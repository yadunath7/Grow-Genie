package com.growgenie.app.util;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.City;
import com.maxmind.geoip2.record.Country;
import com.maxmind.geoip2.record.Location;
import com.maxmind.geoip2.record.Subdivision;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;

@Component
public class GeoIpUtils {

    private DatabaseReader dbReader;

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("GeoLite2-City.mmdb");
            if (resource.exists()) {
                InputStream database = resource.getInputStream();
                dbReader = new DatabaseReader.Builder(database).build();
                System.out.println("GeoLite2-City.mmdb loaded successfully.");
            } else {
                System.err.println("GeoLite2-City.mmdb NOT found in classpath. Will use HTTP fallback.");
            }
        } catch (Throwable e) {
            System.err.println("Failed to load GeoLite2-City database: " + e.getMessage() + ". Will use HTTP fallback.");
        }
    }

    public LocationDTO getLocation(String ip) {
        LocationDTO locationDTO = new LocationDTO();
        if (ip == null || ip.isEmpty() || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.equals("::1")) {
            return locationDTO; // Localhost — skip
        }

        // Clean X-Forwarded-For (take first IP if comma-separated)
        if (ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        // Try local MaxMind DB first
        if (dbReader != null) {
            try {
                InetAddress ipAddress = InetAddress.getByName(ip);
                CityResponse response = dbReader.city(ipAddress);

                Country country = response.getCountry();
                if (country != null && country.getName() != null) {
                    locationDTO.setCountry(country.getName());
                }

                Subdivision subdivision = response.getMostSpecificSubdivision();
                if (subdivision != null && subdivision.getName() != null) {
                    locationDTO.setState(subdivision.getName());
                }

                City city = response.getCity();
                if (city != null && city.getName() != null) {
                    locationDTO.setCity(city.getName());
                }

                Location location = response.getLocation();
                if (location != null) {
                    locationDTO.setLatitude(location.getLatitude());
                    locationDTO.setLongitude(location.getLongitude());
                }

                // If we got a country back, return immediately
                if (locationDTO.getCountry() != null) {
                    return locationDTO;
                }
            } catch (Exception e) {
                System.err.println("MaxMind lookup failed for IP " + ip + ": " + e.getMessage());
            }
        }

        // Fallback: use free ip-api.com (no key needed, 45 req/min on free tier)
        try {
            String apiUrl = "http://ip-api.com/json/" + ip + "?fields=status,country,regionName,city,lat,lon";
            HttpURLConnection conn = (HttpURLConnection) new URL(apiUrl).openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);

            if (conn.getResponseCode() == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
                reader.close();

                String json = sb.toString();
                if (json.contains("\"status\":\"success\"")) {
                    locationDTO.setCountry(extractJson(json, "country"));
                    locationDTO.setState(extractJson(json, "regionName"));
                    locationDTO.setCity(extractJson(json, "city"));

                    String lat = extractJson(json, "lat");
                    String lon = extractJson(json, "lon");
                    if (lat != null) try { locationDTO.setLatitude(Double.parseDouble(lat)); } catch (Exception ignored) {}
                    if (lon != null) try { locationDTO.setLongitude(Double.parseDouble(lon)); } catch (Exception ignored) {}
                }
            }
            conn.disconnect();
        } catch (Exception e) {
            System.err.println("HTTP GeoIP fallback failed for IP " + ip + ": " + e.getMessage());
        }

        return locationDTO;
    }

    /** Simple JSON field extractor — avoids needing extra dependencies */
    private String extractJson(String json, String key) {
        try {
            String search = "\"" + key + "\":";
            int idx = json.indexOf(search);
            if (idx < 0) return null;
            int start = idx + search.length();
            char first = json.charAt(start);
            if (first == '"') {
                int end = json.indexOf('"', start + 1);
                return json.substring(start + 1, end);
            } else {
                // number
                int end = start;
                while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.' || json.charAt(end) == '-')) end++;
                return json.substring(start, end);
            }
        } catch (Exception e) {
            return null;
        }
    }
}
