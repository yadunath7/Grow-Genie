package com.growgenie.app.controller;

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

    @Autowired
    private com.growgenie.app.repository.OrderRepository orderRepository;

    @GetMapping("/products")
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

        if ("purchased_count".equals(action)) {
            Long userId = (Long) session.getAttribute("user_id");
            List<com.growgenie.app.entity.Order> userOrders = orderRepository.findByUserId(userId);
            long count = userOrders.stream().filter(o -> "product".equals(o.getItemType())).count();
            
            response.put("status", "success");
            response.put("count", count);
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
