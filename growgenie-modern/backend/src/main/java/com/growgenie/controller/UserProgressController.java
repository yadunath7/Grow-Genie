package com.growgenie.controller;

import com.growgenie.repository.IdeaRepository;
import com.growgenie.repository.InvoiceRepository;
import com.growgenie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user-progress")
public class UserProgressController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProgress() {
        Long userId = getCurrentUserId();

        // 1. Calculate Sales Progress
        BigDecimal salesGoal = new BigDecimal("100000");
        BigDecimal totalSales = invoiceRepository.sumAmountByUserId(userId);
        
        long salesPercent = 0;
        if (totalSales.compareTo(BigDecimal.ZERO) > 0) {
            salesPercent = totalSales.multiply(new BigDecimal("100"))
                    .divide(salesGoal, 0, RoundingMode.HALF_UP)
                    .min(new BigDecimal("100"))
                    .longValue();
        }

        // 2. Calculate Learning/Search Progress
        long learningGoal = 20;
        long totalQueries = ideaRepository.countByUserId(userId);
        long learningPercent = Math.min(100, Math.round(((double) totalQueries / learningGoal) * 100));

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "sales", Map.of(
                "current", totalSales,
                "goal", salesGoal,
                "percent", salesPercent
            ),
            "learning", Map.of(
                "current", totalQueries,
                "goal", learningGoal,
                "percent", learningPercent
            )
        ));
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails)principal).getUsername() : principal.toString();
        return userRepository.findByEmail(email).get().getId();
    }
}
