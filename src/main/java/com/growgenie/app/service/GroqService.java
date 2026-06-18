package com.growgenie.app.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import com.growgenie.app.service.SettingsService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final String DEFAULT_API_KEY = "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";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private SettingsService settingsService;

    public String callGroqApi(String systemMessage, String userPrompt, boolean jsonMode, List<Map<String, String>> history) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String apiKey = settingsService != null ? settingsService.getSetting("groq_api_key", DEFAULT_API_KEY) : DEFAULT_API_KEY;
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile");
        requestBody.put("temperature", 0.7);

        if (jsonMode) {
            Map<String, String> format = new HashMap<>();
            format.put("type", "json_object");
            requestBody.put("response_format", format);
        }

        List<Map<String, String>> messages = new ArrayList<>();
        
        if (systemMessage != null && !systemMessage.isEmpty()) {
            Map<String, String> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", systemMessage);
            messages.add(sysMsg);
        }

        if (history != null && !history.isEmpty()) {
            messages.addAll(history);
        }

        Map<String, String> usrMsg = new HashMap<>();
        usrMsg.put("role", "user");
        usrMsg.put("content", userPrompt);
        messages.add(usrMsg);

        requestBody.put("messages", messages);

        try {
            String jsonRequest = objectMapper.writeValueAsString(requestBody);
            HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("choices").get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    // Overloaded method for backward compatibility
    public String callGroqApi(String systemMessage, String userPrompt, boolean jsonMode) {
        return callGroqApi(systemMessage, userPrompt, jsonMode, null);
    }
}
