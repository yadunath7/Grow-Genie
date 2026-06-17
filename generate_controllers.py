import os

CONTROLLER_DIR = "src/main/java/com/growgenie/app/controller"
os.makedirs(CONTROLLER_DIR, exist_ok=True)

# 1. UserProgressController
user_progress = """package com.growgenie.app.controller;

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

    @GetMapping("/user_progress.php")
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
        List<Idea> ideas = ideaRepository.findByUserId(userId);
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
"""

# 2. IdeaController
idea_controller = """package com.growgenie.app.controller;

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

    @RequestMapping(value = "/ideas.php", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> handleIdeas(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String startup_name,
            @RequestParam(required = false) String startup_idea,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String budget,
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
            List<Idea> ideas = ideaRepository.findByUserId(userId);
            response.put("status", "success");
            response.put("data", ideas);
            return response;

        } else if ("save".equals(action)) {
            Idea idea = new Idea();
            idea.setUserId(userId);
            idea.setStartupName(startup_name);
            idea.setStartupIdea(startup_idea);
            idea.setCategory(category);
            idea.setBudget(budget);
            idea.setGeneratedRoadmap("AI Roadmap generation is currently simulated.");
            idea.setCreatedAt(LocalDateTime.now());
            ideaRepository.save(idea);

            response.put("status", "success");
            response.put("message", "Idea saved successfully.");
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
"""

# 3. InvoiceController
invoice_controller = """package com.growgenie.app.controller;

import com.growgenie.app.entity.Invoice;
import com.growgenie.app.repository.InvoiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @RequestMapping(value = "/invoices.php", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> handleInvoices(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String client_name,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long invoice_id,
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
            List<Invoice> invoices = invoiceRepository.findByUserId(userId);
            response.put("status", "success");
            response.put("data", invoices);
            return response;

        } else if ("save".equals(action)) {
            Invoice inv = new Invoice();
            inv.setUserId(userId);
            inv.setClientName(client_name);
            inv.setAmount(new BigDecimal(amount != null ? amount : "0"));
            inv.setDescription(description);
            inv.setStatus("pending");
            inv.setCreatedAt(LocalDateTime.now());
            invoiceRepository.save(inv);

            response.put("status", "success");
            response.put("message", "Invoice created successfully.");
            return response;
            
        } else if ("update_status".equals(action)) {
            if (invoice_id != null) {
                Invoice inv = invoiceRepository.findById(invoice_id).orElse(null);
                if (inv != null && inv.getUserId().equals(userId)) {
                    inv.setStatus(status);
                    invoiceRepository.save(inv);
                    response.put("status", "success");
                    response.put("message", "Invoice updated.");
                    return response;
                }
            }
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
"""

# 4. AiController (combines all AI endpoints)
ai_controller = """package com.growgenie.app.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiController {

    private Map<String, Object> checkAuth(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("message", "Unauthorized");
            return err;
        }
        return null;
    }

    @PostMapping("/ai_chat.php")
    public Map<String, Object> handleAiChat(@RequestParam(required = false) String message, HttpServletRequest request) {
        Map<String, Object> authErr = checkAuth(request);
        if (authErr != null) return authErr;

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("response", "Genie says: This is a simulated AI response to: " + message);
        return response;
    }

    @PostMapping("/marketing_ai.php")
    public Map<String, Object> handleMarketingAi(@RequestParam(required = false) String product, 
                                                 @RequestParam(required = false) String budget, 
                                                 HttpServletRequest request) {
        Map<String, Object> authErr = checkAuth(request);
        if (authErr != null) return authErr;

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("strategy", "Simulated Marketing Strategy for " + product + " with budget " + budget + "\\n1. Setup Facebook Ads.\\n2. Create Instagram Reels.\\n3. Track conversions.");
        return response;
    }

    @PostMapping("/faq_bot.php")
    public Map<String, Object> handleFaqBot(@RequestParam(required = false) String question, HttpServletRequest request) {
        Map<String, Object> authErr = checkAuth(request);
        if (authErr != null) return authErr;

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("answer", "Here is a simulated FAQ answer regarding: " + question);
        return response;
    }
}
"""

# 5. ProductController
product_controller = """package com.growgenie.app.controller;

import com.growgenie.app.entity.PlatformProduct;
import com.growgenie.app.repository.PlatformProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private PlatformProductRepository productRepository;

    @GetMapping("/products.php")
    public Map<String, Object> handleProducts(@RequestParam(required = false) String action, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        if ("fetch".equals(action)) {
            List<PlatformProduct> products = productRepository.findAll();
            response.put("status", "success");
            response.put("data", products);
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
"""

files = {
    "UserProgressController.java": user_progress,
    "IdeaController.java": idea_controller,
    "InvoiceController.java": invoice_controller,
    "AiController.java": ai_controller,
    "ProductController.java": product_controller
}

for filename, content in files.items():
    with open(os.path.join(CONTROLLER_DIR, filename), "w") as f:
        f.write(content)

print("Controllers generated successfully.")
