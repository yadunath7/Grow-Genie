package com.growgenie.app.controller;

import com.growgenie.app.entity.Idea;
import com.growgenie.app.repository.IdeaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Autowired
    private com.growgenie.app.service.MarketResearchService marketResearchService;

    @RequestMapping(value = "/ideas", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> handleIdeas(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String idea_name,
            @RequestParam(required = false) String startup_idea,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String budget,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String location,
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
            idea.setLocation(location);
            idea.setCreatedAt(java.time.LocalDateTime.now());
            
            // Step 1: Call MarketResearchService to search for local competitors
            List<com.growgenie.app.model.Competitor> competitors = new ArrayList<>();
            if (location != null && !location.trim().isEmpty()) {
                competitors = marketResearchService.discoverCompetitors(startup_idea, category, location);
            }
            
            // Step 2: Format competitor data for Groq
            StringBuilder competitorStr = new StringBuilder();
            if (!competitors.isEmpty()) {
                competitorStr.append("Below are the verified local competitors found via OpenStreetMap in the target location (").append(location).append("), sorted by proximity:\n");
                for (com.growgenie.app.model.Competitor comp : competitors) {
                    competitorStr.append("- ").append(comp.getDisplayName())
                           .append(" (Address: ").append(comp.getAddress())
                           .append(", City: ").append(comp.getCity())
                           .append(", State: ").append(comp.getState())
                           .append(", Distance: ").append(Math.round(comp.getDistance())).append(" meters")
                           .append(", Category: ").append(comp.getCategory()).append(")\n");
                }
            } else {
                competitorStr.append("No specific competitors found in the area. Provide market intelligence based on general industry benchmarks for the category and budget in: ").append(location != null ? location : "the target market").append(".\n");
            }
            
            String systemMessage = "You are an expert business consultant, market analyst, and startup strategist. Generate a highly detailed, uniquely tailored execution plan and a professional-grade Market Intelligence Report for the specific startup provided.\n"
                + "    You MUST return ONLY a JSON object with EXACTLY these five top-level keys:\n"
                + "    1. 'roadmap': An object where keys are step titles (e.g. 'Step 1: Foundation') and values are an object containing two keys: 'summary' (a brief overview) and 'tasks' (an array of 4-6 highly detailed, actionable tasks). Generate exactly 6 steps.\n"
                + "    CRITICAL FOR ROADMAP: Do NOT output generic business advice. Every single step and task MUST directly reference the startup's unique idea, category, budget, and local market context. Each step must build logically on the previous one to form a complete journey.\n"
                + "    2. 'market_strategy': A detailed string explaining the go-to-market strategy, target audience, and positioning tailored to this specific idea.\n"
                + "    3. 'ads': An object with keys mapping to recommended advertising channels (e.g., 'Instagram Ads', 'Local Print'), each containing specific ad copy ideas, campaign types, and execution strategies explicitly designed for this startup.\n"
                + "    4. 'product_desc': A highly compelling and SEO-friendly product/service description.\n"
                + "    5. 'market_intelligence': A detailed Market Intelligence Report object containing exactly these keys:\n"
                + "       - 'market_gap_analysis': A detailed array of 3-4 clear gaps in the local market (e.g., underserved offerings, operational issues of competitors).\n"
                + "       - 'competitor_analysis': A detailed strategy explaining how to position and grow the business to outcompete local rivals.\n"
                + "       - 'usp_recommendations': A detailed, highly strategic Unique Selling Proposition to make this startup stand out.\n"
                + "       - 'pricing_strategy': Specific pricing recommendations based on the local market and category.\n"
                + "       - 'customer_acquisition_strategy': A detailed plan on how to acquire the first 100 customers in the specified location.\n"
                + "       - 'launch_roadmap': An array of 4 objects representing location-based launch phases (each object with keys 'phase' e.g. 'Phase 1: Location Setup' and 'tasks' which is an array of 2-3 actionable setup tasks).\n"
                + "       - 'competitors': An array of objects where you copy the provided competitors (in the exact order, including distance, city, state, and address), adding a new field 'analysis' (1-2 sentences) explaining how the user can compete with/beat this specific competitor. DO NOT generate fictional competitors; strictly use ONLY the verified OpenStreetMap competitors provided.\n"
                + "    \n"
                + "    IMPORTANT:\n"
                + "    - Use " + (language != null ? language : "English") + " for all content output.\n"
                + "    - Be practical, highly detailed (McKinsey/BCG quality), and specific to the category, budget, and location provided.\n"
                + "    - Return valid JSON only, without markdown wrapping.";

            String prompt = "Startup Name: " + (idea_name != null ? idea_name : idea.getIdeaName()) + ". \n"
                + "Startup Idea: " + startup_idea + ". \n"
                + "Category: " + category + ". \n"
                + "Budget: ₹" + budget + ". \n"
                + "Business Location: " + (location != null ? location : "Not specified") + ". \n\n"
                + competitorStr.toString() + "\n"
                + "Please thoroughly analyze this specific startup idea and local competitors, and generate the complete business plan and Market Intelligence JSON.";

            String jsonPayload = groqService.callGroqApi(systemMessage, prompt, true);

            if (jsonPayload == null || jsonPayload.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Genie plan generation failed.");
                return response;
            }
            
            // Step 3: Parse and enrich the JSON response with competitor data if Groq missed it
            String processedJson = jsonPayload;
            Map<String, Object> generatedMap = new HashMap<>();
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                // Clean potential markdown blocks
                String cleaned = jsonPayload.replaceAll("```json|```", "").trim();
                generatedMap = mapper.readValue(cleaned, Map.class);
                
                // Inject competitor safety fallback
                if (generatedMap.containsKey("market_intelligence")) {
                    Map<String, Object> marketIntelligence = (Map<String, Object>) generatedMap.get("market_intelligence");
                    if (!marketIntelligence.containsKey("competitors") || marketIntelligence.get("competitors") == null || ((List)marketIntelligence.get("competitors")).isEmpty()) {
                        marketIntelligence.put("competitors", competitors);
                    }
                } else {
                    Map<String, Object> marketIntelligence = new HashMap<>();
                    marketIntelligence.put("market_gap_analysis", new ArrayList<>());
                    marketIntelligence.put("competitor_analysis", "Market intelligence report generated for " + location);
                    marketIntelligence.put("competitors", competitors);
                    generatedMap.put("market_intelligence", marketIntelligence);
                }
                
                processedJson = mapper.writeValueAsString(generatedMap);
            } catch (Exception e) {
                e.printStackTrace();
                // If parsing failed, try to inject a simple structure or wrap it
                try {
                    Map<String, Object> wrapMap = new HashMap<>();
                    wrapMap.put("roadmap", jsonPayload);
                    Map<String, Object> marketIntelligence = new HashMap<>();
                    marketIntelligence.put("market_gap_analysis", new ArrayList<>());
                    marketIntelligence.put("competitor_analysis", "Market analysis created for " + location);
                    marketIntelligence.put("competitors", competitors);
                    wrapMap.put("market_intelligence", marketIntelligence);
                    processedJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(wrapMap);
                    generatedMap = wrapMap;
                } catch (Exception ex) {
                    // ignore
                }
            }

            idea.setRoadmap(processedJson);
            idea.setCreatedAt(LocalDateTime.now());
            ideaRepository.save(idea);

            response.put("status", "success");
            response.put("message", "Idea generated and saved successfully.");
            response.put("data", generatedMap);
            
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
