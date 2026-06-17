package com.growgenie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.growgenie.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/marketing")
public class MarketingController {

    @Autowired
    private AiService aiService;

    @PostMapping("/strategy")
    public ResponseEntity<?> generateStrategy(@RequestBody Map<String, String> request) {
        String product = request.get("product");
        String budget = request.get("budget");

        if (product == null || product.isEmpty() || budget == null || budget.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Product and budget are required."));
        }

        try {
            String planJson = aiService.generateMarketingStrategy(product, budget);
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseData = mapper.readValue(planJson, Map.class);
            return ResponseEntity.ok(Map.of("status", "success", "data", responseData));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Failed to generate strategy: " + e.getMessage()
            ));
        }
    }
}
