package com.growgenie.app.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiController {

    private Map<String, Object> checkAuth(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("message", "Unauthorized");
            return err;
        }
        return null;
    }
    @Autowired
    private com.growgenie.app.service.GroqService groqService;

    @PostMapping("/ai_chat")
    public Map<String, Object> handleAiChat(@RequestParam(required = false) String question, 
                                            @RequestParam(required = false) String message,
                                            @RequestParam(required = false) String history,
                                            HttpServletRequest request) {
        Map<String, Object> authErr = checkAuth(request);
        if (authErr != null) return authErr;

        String input = (question != null && !question.isEmpty()) ? question : message;
        
        List<Map<String, String>> conversationHistory = null;
        if (history != null && !history.isEmpty()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                conversationHistory = mapper.readValue(history, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, String>>>(){});
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        String responseText = groqService.callGroqApi(
            "You are a helpful and energetic voice assistant for the GrowGenie startup platform. Keep your answers conversational and concise. Do NOT use any markdown formatting, asterisks, or bold text.",
            input, false, conversationHistory
        );

        if (responseText != null) {
            responseText = responseText.replace("*", "");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("answer", responseText != null ? responseText : "I am having trouble connecting to the brain right now!");
        response.put("response", responseText != null ? responseText : "I am having trouble connecting to the brain right now!");
        return response;
    }

    @PostMapping("/marketing_ai")
    public Map<String, Object> handleMarketingAi(@RequestParam(required = false) String product, 
                                                 @RequestParam(required = false) String budget, 
                                                 HttpServletRequest request) {
        Map<String, Object> authErr = checkAuth(request);
        if (authErr != null) return authErr;

        String prompt = "Product: " + product + ". Budget: " + budget + ".";
        String systemPrompt = "You are a marketing strategist for a startup platform. Provide a highly actionable, creative marketing strategy. "
            + "Return ONLY a valid JSON object with the following schema: "
            + "{ \"plan_title\": \"(Catchy title)\", "
            + "\"online_strategy\": \"(Paragraph describing online approach)\", "
            + "\"offline_strategy\": \"(Paragraph describing offline approach)\", "
            + "\"allocation\": { \"Instagram Ads\": 40, \"Google Ads\": 30, \"Local Events\": 30 }, "
            + "\"top_campaigns\": [ { \"channel\": \"Meta Ads\", \"name\": \"Brand Awareness\", \"hook\": \"Catchy hook here\" } ], "
            + "\"step_by_step\": [ \"Step 1...\", \"Step 2...\" ] }. Do not include markdown formatting or the word 'json'.";

        String strategyJsonStr = groqService.callGroqApi(systemPrompt, prompt, true, null);

        Map<String, Object> response = new HashMap<>();
        if (strategyJsonStr != null) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> strategyData = mapper.readValue(strategyJsonStr, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>(){});
                response.put("status", "success");
                response.put("data", strategyData);
            } catch (Exception e) {
                e.printStackTrace();
                response.put("status", "error");
                response.put("message", "Failed to parse marketing strategy.");
            }
        } else {
            response.put("status", "error");
            response.put("message", "Failed to generate marketing strategy.");
        }
        return response;
    }

    @PostMapping("/faq_bot")
    public Map<String, Object> handleFaqBot(@RequestParam(required = false) String question, HttpServletRequest request) {
        Map<String, Object> authErr = checkAuth(request);
        if (authErr != null) return authErr;

        String answer = groqService.callGroqApi(
            "You are a knowledgeable FAQ assistant for GrowGenie, a startup idea generator and planner platform. Answer the user's question clearly.",
            question, false
        );

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("answer", answer != null ? answer : "Failed to generate answer.");
        return response;
    }
}
