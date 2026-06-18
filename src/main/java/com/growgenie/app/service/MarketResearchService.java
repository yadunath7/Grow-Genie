package com.growgenie.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.growgenie.app.model.Competitor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class MarketResearchService {

    @Autowired
    private GroqService groqService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final int EARTH_RADIUS_METERS = 6371000;

    public List<Competitor> discoverCompetitors(String startupIdea, String category, String location) {
        List<Competitor> competitors = new ArrayList<>();

        if (location == null || location.trim().isEmpty()) {
            return competitors; // Do not generate mock data
        }

        try {
            // Step 1: Geocode location using Nominatim
            double[] coordinates = getCoordinates(location);
            if (coordinates == null) {
                return competitors; // Do not generate mock data
            }
            double lat = coordinates[0];
            double lon = coordinates[1];

            // Step 2: Get expanded OSM tags using Groq
            List<Map<String, String>> osmTags = getOsmTagsFromGroq(startupIdea, category);
            if (osmTags.isEmpty()) {
                // Fallback generic tag
                Map<String, String> fallback = new HashMap<>();
                fallback.put("shop", "yes");
                osmTags.add(fallback);
            }

            // Step 3: Query Overpass API
            String overpassQuery = buildOverpassQuery(osmTags, lat, lon);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/x-www-form-urlencoded");
            String body = "data=" + URLEncoder.encode(overpassQuery, StandardCharsets.UTF_8.toString());
            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://overpass-api.de/api/interpreter",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode elements = root.path("elements");
                
                Map<String, Competitor> uniqueCompetitors = new HashMap<>();
                if (elements.isArray()) {
                    for (JsonNode el : elements) {
                        JsonNode tags = el.path("tags");
                        if (!tags.isMissingNode() && tags.has("name")) {
                            String name = tags.get("name").asText();
                            
                            if (uniqueCompetitors.containsKey(name)) {
                                continue;
                            }

                            double compLat = 0;
                            double compLon = 0;
                            if (el.has("lat") && el.has("lon")) {
                                compLat = el.get("lat").asDouble();
                                compLon = el.get("lon").asDouble();
                            } else if (el.has("center")) {
                                compLat = el.path("center").path("lat").asDouble();
                                compLon = el.path("center").path("lon").asDouble();
                            }
                            
                            if (compLat == 0 && compLon == 0) continue;

                            double distance = calculateDistance(lat, lon, compLat, compLon);

                            // Strict Nominatim Reverse Geocoding
                            Map<String, String> geoInfo = reverseGeocode(compLat, compLon);
                            String displayName = geoInfo.getOrDefault("displayName", name);
                            String city = geoInfo.getOrDefault("city", "");
                            String state = geoInfo.getOrDefault("state", "");

                            // Fallback to tags address if displayName is missing
                            String addressStr = displayName;
                            if (addressStr.isEmpty()) {
                                StringBuilder addr = new StringBuilder();
                                if (tags.has("addr:street")) addr.append(tags.get("addr:street").asText()).append(", ");
                                if (tags.has("addr:city")) addr.append(tags.get("addr:city").asText());
                                addressStr = addr.toString();
                                if (addressStr.endsWith(", ")) addressStr = addressStr.substring(0, addressStr.length() - 2);
                                if (addressStr.isEmpty()) addressStr = location;
                            }

                            Competitor comp = new Competitor(name, displayName, addressStr, city, state, category, distance);
                            uniqueCompetitors.put(name, comp);
                            
                            if (uniqueCompetitors.size() >= 8) {
                                break;
                            }
                        }
                    }
                }
                competitors.addAll(uniqueCompetitors.values());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        // Step 4: Sort by Distance
        competitors.sort(Comparator.comparingDouble(Competitor::getDistance));

        return competitors;
    }

    private double[] getCoordinates(String location) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://nominatim.openstreetmap.org/search")
                    .queryParam("q", location)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .build()
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "GrowGenie/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.isArray() && root.size() > 0) {
                    JsonNode first = root.get(0);
                    double lat = first.path("lat").asDouble();
                    double lon = first.path("lon").asDouble();
                    return new double[]{lat, lon};
                }
            }
        } catch (Exception e) {
            System.err.println("Geocoding failed for: " + location);
            e.printStackTrace();
        }
        return null;
    }

    private Map<String, String> reverseGeocode(double lat, double lon) {
        Map<String, String> result = new HashMap<>();
        try {
            // Strictly enforce 1 request/second rule for Nominatim Free API
            Thread.sleep(1000); 
            
            String url = UriComponentsBuilder.fromHttpUrl("https://nominatim.openstreetmap.org/reverse")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("format", "json")
                    .build()
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "GrowGenie/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                result.put("displayName", root.path("display_name").asText());
                JsonNode addressNode = root.path("address");
                
                String city = addressNode.path("city").asText();
                if (city.isEmpty()) city = addressNode.path("town").asText();
                if (city.isEmpty()) city = addressNode.path("village").asText();
                if (city.isEmpty()) city = addressNode.path("state_district").asText();
                
                result.put("city", city);
                result.put("state", addressNode.path("state").asText());
            }
        } catch (Exception e) {
            System.err.println("Reverse geocoding failed for: " + lat + "," + lon);
        }
        return result;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    private List<Map<String, String>> getOsmTagsFromGroq(String startupIdea, String category) {
        String systemMessage = "You are an OpenStreetMap (OSM) expert. Given a startup idea and category, provide 3 to 6 broad key-value tag pairs to search for existing businesses using the Overpass API.\n" +
                               "IMPORTANT: If the category is related to food, cafe, restaurant, or beverages, ALWAYS include these tags: " +
                               "{\"key\":\"amenity\",\"value\":\"cafe\"}, {\"key\":\"amenity\",\"value\":\"restaurant\"}, {\"key\":\"amenity\",\"value\":\"fast_food\"}, {\"key\":\"shop\",\"value\":\"tea\"}, {\"key\":\"shop\",\"value\":\"coffee\"}.\n" +
                               "Output ONLY a valid JSON array of objects with 'key' and 'value'. Do not wrap in markdown.";
        String prompt = "Startup Idea: " + startupIdea + "\nCategory: " + category;
        String json = groqService.callGroqApi(systemMessage, prompt, true);
        
        List<Map<String, String>> tagsList = new ArrayList<>();
        try {
            if (json != null && !json.trim().isEmpty()) {
                String cleaned = json.replaceAll("```json|```", "").trim();
                JsonNode arr = objectMapper.readTree(cleaned);
                if (arr.isArray()) {
                    for (JsonNode n : arr) {
                        Map<String, String> tag = new HashMap<>();
                        tag.put("key", n.path("key").asText());
                        tag.put("value", n.path("value").asText());
                        tagsList.add(tag);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to parse OSM tags JSON: " + json);
        }
        return tagsList;
    }

    private String buildOverpassQuery(List<Map<String, String>> tags, double lat, double lon) {
        StringBuilder query = new StringBuilder();
        query.append("[out:json][timeout:25];\n(\n");
        for (Map<String, String> tag : tags) {
            String key = tag.get("key");
            String value = tag.get("value");
            // Search within 5000 meters (5km) radius
            query.append(String.format("  node[\"%s\"=\"%s\"](around:5000,%f,%f);\n", key, value, lat, lon));
            query.append(String.format("  way[\"%s\"=\"%s\"](around:5000,%f,%f);\n", key, value, lat, lon));
        }
        query.append(");\nout center 15;\n");
        return query.toString();
    }
}
