package com.growgenie.controller;

import com.growgenie.model.FaqKnowledge;
import com.growgenie.repository.FaqKnowledgeRepository;
import com.growgenie.repository.UserRepository;
import com.growgenie.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/faq")
public class FaqController {

    @Autowired
    private AiService aiService;

    @Autowired
    private FaqKnowledgeRepository faqKnowledgeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/knowledge")
    public ResponseEntity<?> getKnowledge() {
        Long userId = getCurrentUserId();
        Optional<FaqKnowledge> kbOpt = faqKnowledgeRepository.findByUserId(userId);
        String content = kbOpt.map(FaqKnowledge::getContent).orElse("");
        return ResponseEntity.ok(Map.of("status", "success", "content", content));
    }

    @PostMapping("/train")
    public ResponseEntity<?> train(@RequestBody Map<String, String> req) {
        String content = req.get("content");
        if (content == null || content.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Content cannot be empty."));
        }

        Long userId = getCurrentUserId();
        Optional<FaqKnowledge> kbOpt = faqKnowledgeRepository.findByUserId(userId);

        FaqKnowledge kb = kbOpt.orElseGet(FaqKnowledge::new);
        kb.setUserId(userId);
        kb.setContent(content);
        kb.setUpdatedAt(LocalDateTime.now());
        
        faqKnowledgeRepository.save(kb);

        return ResponseEntity.ok(Map.of("status", "success", "message", "Genie Assistant trained successfully!"));
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> req) {
        String question = req.get("question");
        if (question == null || question.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Question cannot be empty."));
        }

        Long userId = getCurrentUserId();
        Optional<FaqKnowledge> kbOpt = faqKnowledgeRepository.findByUserId(userId);
        String kbContent = kbOpt.map(FaqKnowledge::getContent).orElse("");

        if (kbContent.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "answer", "I haven't been trained yet! Please paste some information in the Knowledge Base first."
            ));
        }

        String systemMsg = "You are Genie, a smart and friendly business assistant for GrowGenie — an AI-powered startup platform. "
                         + "Answer questions concisely (2-4 sentences). Help with startup advice, marketing, invoices, and business growth. "
                         + "Be warm, practical, and encouraging. "
                         + "Use the following knowledge base content to help answer: " + kbContent;

        try {
            String answer = aiService.askGenie(question, systemMsg);
            return ResponseEntity.ok(Map.of("status", "success", "answer", answer));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Genie is momentarily unavailable."));
        }
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails)principal).getUsername() : principal.toString();
        return userRepository.findByEmail(email).get().getId();
    }
}
