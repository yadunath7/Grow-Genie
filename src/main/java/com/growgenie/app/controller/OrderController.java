package com.growgenie.app.controller;

import com.growgenie.app.entity.Order;
import com.growgenie.app.entity.PlatformProduct;
import com.growgenie.app.repository.OrderRepository;
import com.growgenie.app.repository.PlatformProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PlatformProductRepository productRepository;

    @GetMapping("/orders")
    public Map<String, Object> getUserOrders(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        Long userId = (Long) session.getAttribute("user_id");
        List<Order> orders = orderRepository.findByUserId(userId);
        
        List<Map<String, Object>> dataList = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", order.getId());
            item.put("paymentId", order.getPaymentId());
            item.put("amount", order.getAmount());
            item.put("itemType", order.getItemType());
            item.put("createdAt", order.getCreatedAt());

            if ("subscription".equals(order.getItemType())) {
                item.put("itemName", "Subscription Upgrade");
            } else if ("product".equals(order.getItemType())) {
                PlatformProduct p = productRepository.findById(order.getItemId()).orElse(null);
                item.put("itemName", p != null ? p.getName() : "Platform Product #" + order.getItemId());
            } else {
                item.put("itemName", "Other Purchase");
            }
            dataList.add(item);
        }

        response.put("status", "success");
        response.put("data", dataList);
        return response;
    }
}
