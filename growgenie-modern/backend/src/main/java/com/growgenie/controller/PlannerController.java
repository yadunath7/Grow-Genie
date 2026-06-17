package com.growgenie.controller;

import com.growgenie.model.Idea;
import com.growgenie.model.User;
import com.growgenie.repository.IdeaRepository;
import com.growgenie.repository.UserRepository;
import com.growgenie.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/planner")
public class PlannerController {

    @Autowired
    private AiService aiService;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        Long userId = getCurrentUserId();
        List<Idea> history = ideaRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(Map.of("status", "success", "data", history));
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> req) {
        String ideaName = req.get("ideaName");
        String startupIdea = req.get("startupIdea");
        String category = req.get("category");
        String budget = req.get("budget");
        String language = req.getOrDefault("language", "English");

        if (ideaName == null || startupIdea == null || category == null || budget == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "All fields are required."));
        }

        try {
            String planJson = aiService.generateBusinessPlan(ideaName, startupIdea, category, budget, language);
            
            Idea idea = new Idea();
            idea.setUserId(getCurrentUserId());
            idea.setIdeaName(ideaName);
            idea.setCategory(category);
            idea.setBudget(budget);
            idea.setRoadmap(planJson);
            
            ideaRepository.save(idea);

            return ResponseEntity.ok(Map.of("status", "success", "data", planJson));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Generation failed: " + e.getMessage()));
        }
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails)principal).getUsername() : principal.toString();
        return userRepository.findByEmail(email).get().getId();
    }
}
