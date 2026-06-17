package com.growgenie.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String generateBusinessPlan(String startupName, String idea, String category, String budget, String lang) {
        RestTemplate restTemplate = new RestTemplate();
        
        String systemPrompt = "You are the GrowGenie Business Strategist. Generate a comprehensive JSON business plan..."; 
        String userPrompt = String.format("Name: %s, Idea: %s, Category: %s, Budget: %s, Language: %s", 
                                            startupName, idea, category, budget, lang);

        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama3-8b-8192");
        request.put("messages", Arrays.asList(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));
        request.put("response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
        
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    public String askGenie(String question, String systemPrompt) {
        RestTemplate restTemplate = new RestTemplate();
        
        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama-3.3-70b-versatile");
        request.put("messages", Arrays.asList(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", question)
        ));
        request.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
        
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    public String generateMarketingStrategy(String product, String budget) {
        RestTemplate restTemplate = new RestTemplate();
        
        String systemPrompt = "You are a world-class growth hacker and digital marketing director. "
                            + "Generate a market-dominating strategy and specific high-converting campaigns. "
                            + "You MUST return ONLY a JSON object with these keys:\n"
                            + "- 'plan_title': A bold strategy name.\n"
                            + "- 'online_strategy': Comprehensive digital approach.\n"
                            + "- 'offline_strategy': Guerrilla and traditional marketing tactics.\n"
                            + "- 'allocation': Object with platforms and % (e.g. {'Facebook Ads': 40, 'Google Ads': 30, 'Instagram Ads': 30}).\n"
                            + "- 'top_campaigns': Array of 3 objects with {'name', 'channel', 'hook'}.\n"
                            + "- 'step_by_step': Array of 5 execution steps.";

        String userPrompt = String.format("Product: %s. Budget: ₹%s/month. "
                            + "Create a detailed growth plan. Focus on maximizing ROI in the Indian market. "
                            + "Include specific 'hooks' for the campaigns that will grab attention.",
                            product, budget);

        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama-3.3-70b-versatile");
        request.put("messages", Arrays.asList(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));
        request.put("response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
        
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    public String generateMarketInsight(String platform) {
        RestTemplate restTemplate = new RestTemplate();
        
        String systemPrompt = "You are a marketing data scientist. "
                            + "Provide a single, powerful, and data-driven market insight for the specific platform mentioned. "
                            + "The insight should be concise (1-2 sentences), mention a percentage or specific trend, and be focused on the Indian market if applicable. "
                            + "Return ONLY a JSON object with the key 'insight'.";

        String userPrompt = String.format("Provide a high-impact market insight for: %s.", platform);

        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama-3.3-70b-versatile");
        request.put("messages", Arrays.asList(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));
        request.put("response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
        
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }
}


