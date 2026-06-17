package com.growgenie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.growgenie.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/market-insights")
public class MarketInsightController {

    @Autowired
    private AiService aiService;

    @GetMapping
    public ResponseEntity<?> getMarketInsight(@RequestParam(value = "platform", defaultValue = "Facebook Ads") String platform) {
        try {
            String insightJson = aiService.generateMarketInsight(platform);
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseData = mapper.readValue(insightJson, Map.class);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "insight", responseData.get("insight")
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Failed to generate market insight: " + e.getMessage()
            ));
        }
    }
}
