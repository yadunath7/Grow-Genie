package com.growgenie.app.controller;

import com.growgenie.app.entity.Idea;
import com.growgenie.app.entity.Invoice;
import com.growgenie.app.repository.IdeaRepository;
import com.growgenie.app.repository.InvoiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserProgressController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private IdeaRepository ideaRepository;

    @GetMapping("/user_progress")
    public Map<String, Object> getUserProgress(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        Long userId = (Long) session.getAttribute("user_id");

        // Sales Progress
        int salesGoal = 100000;
        List<Invoice> invoices = invoiceRepository.findByUserId(userId);
        double totalSales = invoices.stream().mapToDouble(i -> i.getAmount().doubleValue()).sum();
        int salesPercent = (int) Math.min(100, Math.round((totalSales / salesGoal) * 100));

        // Learning Progress
        int learningGoal = 20;
        List<Idea> ideas = ideaRepository.findByUserIdOrderByIdDesc(userId);
        int totalQueries = ideas.size();
        int learningPercent = Math.min(100, Math.round(((float) totalQueries / learningGoal) * 100));

        response.put("status", "success");
        
        Map<String, Object> sales = new HashMap<>();
        sales.put("current", totalSales);
        sales.put("goal", salesGoal);
        sales.put("percent", salesPercent);
        
        Map<String, Object> learning = new HashMap<>();
        learning.put("current", totalQueries);
        learning.put("goal", learningGoal);
        learning.put("percent", learningPercent);
        
        response.put("sales", sales);
        response.put("learning", learning);
        
        return response;
    }
}
