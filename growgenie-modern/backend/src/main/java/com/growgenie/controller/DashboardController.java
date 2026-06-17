package com.growgenie.controller;

import com.growgenie.repository.IdeaRepository;
import com.growgenie.repository.InvoiceRepository;
import com.growgenie.repository.ProductRepository;
import com.growgenie.model.User;
import com.growgenie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalGenerations", ideaRepository.countByUserId(userId));
        stats.put("invoicesSent", invoiceRepository.countByUserId(userId));
        stats.put("catalogItems", productRepository.count());
        stats.put("faqEntries", 0); // Placeholder for now
        
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", stats
        ));
    }
}
