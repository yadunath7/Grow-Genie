package com.growgenie.app.controller;

import com.growgenie.app.entity.Idea;
import com.growgenie.app.repository.IdeaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class IdeaController {

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private com.growgenie.app.service.GroqService groqService;

    @RequestMapping(value = "/ideas", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> handleIdeas(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String idea_name,
            @RequestParam(required = false) String startup_idea,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String budget,
            @RequestParam(required = false) String language,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        Long userId = (Long) session.getAttribute("user_id");

        if ("fetch".equals(action)) {
            List<Idea> ideas = ideaRepository.findByUserIdOrderByIdDesc(userId);
            response.put("status", "success");
            response.put("data", ideas);
            return response;

        } else if ("generate".equals(action) || "save".equals(action)) {
            Idea idea = new Idea();
            idea.setUserId(userId);
            idea.setIdeaName(idea_name != null ? idea_name : startup_idea);
            idea.setCategory(category);
            idea.setBudget(budget);
            idea.setCreatedAt(java.time.LocalDateTime.now());
            
            String systemMessage = "You are an expert business consultant. Generate a highly detailed, uniquely tailored execution plan for the specific startup provided.\n"
                + "    You MUST return ONLY a JSON object with EXACTLY these four top-level keys:\n"
                + "    1. 'roadmap': An object where keys are step titles (e.g. 'Step 1: Foundation') and values are an object containing two keys: 'summary' (a brief overview) and 'tasks' (an array of 4-6 highly detailed, actionable tasks). Generate exactly 6 steps.\n"
                + "    CRITICAL FOR ROADMAP: Do NOT output generic business advice. Every single step and task MUST directly reference the startup's unique idea, category, and budget. Each step must build logically on the previous one to form a complete journey.\n"
                + "    2. 'market_strategy': A detailed string explaining the go-to-market strategy, target audience, and positioning tailored to this specific idea.\n"
                + "    3. 'ads': An object with keys mapping to recommended advertising channels (e.g., 'Instagram Ads', 'Local Print'), each containing specific ad copy ideas, campaign types, and execution strategies explicitly designed for this startup.\n"
                + "    4. 'product_desc': A highly compelling and SEO-friendly product/service description.\n"
                + "    \n"
                + "    IMPORTANT:\n"
                + "    - Use " + (language != null ? language : "English") + " for all content output.\n"
                + "    - Be practical, actionable, and specific to the category and budget provided.\n"
                + "    - Return valid JSON only, without markdown wrapping.";

            String prompt = "Startup Name: " + (idea_name != null ? idea_name : idea.getIdeaName()) + ". \n"
                + "Startup Idea: " + startup_idea + ". \n"
                + "Category: " + category + ". \n"
                + "Budget: ₹" + budget + ". \n"
                + "Please thoroughly analyze this specific startup idea and generate the complete business plan JSON tailored exclusively to it.";

            String jsonPayload = groqService.callGroqApi(systemMessage, prompt, true);

            if (jsonPayload == null || jsonPayload.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Genie plan generation failed.");
                return response;
            }
            
            idea.setRoadmap(jsonPayload);
            idea.setCreatedAt(LocalDateTime.now());
            ideaRepository.save(idea);

            response.put("status", "success");
            response.put("message", "Idea generated and saved successfully.");
            
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> generatedMap = mapper.readValue(jsonPayload, Map.class);
                response.put("data", generatedMap);
            } catch (Exception e) {
                // If it fails to parse as map, just wrap it
                Map<String, Object> dataResponse = new HashMap<>();
                dataResponse.put("roadmap", jsonPayload);
                response.put("data", dataResponse);
            }
            
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
