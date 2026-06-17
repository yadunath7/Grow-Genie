package com.growgenie.controller;

import com.growgenie.model.User;
import com.growgenie.repository.IdeaRepository;
import com.growgenie.repository.UserRepository;
import com.growgenie.repository.InvoiceRepository;
import com.growgenie.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalIdeas = ideaRepository.count();
        long premiumUsers = userRepository.countBySubscriptionStatus("active");
        BigDecimal totalProfit = orderRepository.sumTotalProfit();
        
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", Map.of(
                "totalUsers", totalUsers,
                "totalIdeas", totalIdeas,
                "premiumUsers", premiumUsers,
                "totalProfit", totalProfit
            )
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(Map.of("status", "success", "data", users));
    }
}
