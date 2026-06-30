package com.growgenie.app.controller;

import com.growgenie.app.repository.TeamMemberRepository;
import com.growgenie.app.repository.TestimonialRepository;
import com.growgenie.app.repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;
import java.util.HashMap;
import com.growgenie.app.repository.UserRepository;
import com.growgenie.app.repository.OrderRepository;
import com.growgenie.app.repository.PlatformProductRepository;

@Controller
public class WebController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PlatformProductRepository platformProductRepository;

    @Autowired
    private com.growgenie.app.service.SettingsService settingsService;

    @GetMapping({"/", "/index"})
    public String index(Model model) {
        model.addAttribute("testimonials", testimonialRepository.findAll());
        model.addAttribute("team_members", teamMemberRepository.findAll());
        
        model.addAttribute("landing_hero_title", settingsService.getSetting("landing_hero_title", "Navigating the startup landscape for success"));
        model.addAttribute("landing_hero_subtitle", settingsService.getSetting("landing_hero_subtitle", "Our startup assistant helps founders grow and succeed through a range of tools including Genie roadmaps, marketing strategies, and invoice creation."));
        return "index";
    }

    @GetMapping({"/about"})
    public String about(Model model) {
        model.addAttribute("about_title", settingsService.getSetting("about_title", "We are the architects of startup success"));
        model.addAttribute("about_content", settingsService.getSetting("about_content", "GrowGenie was founded on a simple belief: every great idea deserves the right tools to succeed. We bridge the gap between innovation and execution."));
        return "about";
    }

    @GetMapping({"/login"})
    public String login() {
        return "login";
    }

    @GetMapping({"/register"})
    public String register() {
        return "register";
    }

    @GetMapping({"/dashboard"})
    public String dashboard(Model model) {
        model.addAttribute("subscription_plans", subscriptionPlanRepository.findAll());
        return "dashboard";
    }

    @GetMapping({"/ad_campaign"})
    public String adCampaign() {
        return "ad_campaign";
    }

    @GetMapping({"/faq_bot"})
    public String faqBot() {
        return "faq_bot";
    }

    @GetMapping({"/ideas"})
    public String ideas() {
        return "ideas";
    }

    @GetMapping({"/invoices"})
    public String invoices() {
        return "invoices";
    }

    @GetMapping({"/marketing"})
    public String marketing() {
        return "marketing";
    }

    @GetMapping({"/products"})
    public String products() {
        return "products";
    }

    @GetMapping({"/profile"})
    public String profile(Model model) {
        model.addAttribute("subscription_plans", subscriptionPlanRepository.findAll());
        return "profile";
    }

    @GetMapping({"/progress"})
    public String progress() {
        return "progress";
    }

    @GetMapping({"/verify"})
    public String verify() {
        return "verify";
    }

    @PostMapping("/verify")
    @ResponseBody
    public Map<String, Object> verifyPayment(
            @RequestParam("razorpay_payment_id") String paymentId,
            @RequestParam("type") String type,
            @RequestParam("amount") Double amount,
            @RequestParam(value = "plan_name", required = false) String planName,
            @RequestParam(value = "days", required = false) Integer days,
            @RequestParam(value = "product_ids", required = false) String productIds,
            jakarta.servlet.http.HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();
        jakarta.servlet.http.HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }
        Long userId = (Long) session.getAttribute("user_id");

        if ("subscription".equals(type)) {
            com.growgenie.app.entity.User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setSubscriptionStatus("premium");
                java.time.LocalDate newExpiry = java.time.LocalDate.now().plusDays(days != null ? days : 30);
                user.setTrialEndDate(newExpiry);
                userRepository.save(user);

                com.growgenie.app.entity.Order order = new com.growgenie.app.entity.Order();
                order.setUserId(userId);
                order.setItemType("subscription");
                order.setItemId(0L);
                order.setAmount(amount);
                order.setPaymentId(paymentId);
                order.setCreatedAt(java.time.LocalDateTime.now());
                orderRepository.save(order);

                session.setAttribute("subscription_status", "premium");

                response.put("status", "success");
                response.put("message", "Subscription verified and upgraded.");
            } else {
                response.put("status", "error");
                response.put("message", "User not found.");
            }
        } else if ("product".equals(type)) {
            if (productIds != null && !productIds.isEmpty()) {
                String[] pIds = productIds.split(",");
                for (String pIdStr : pIds) {
                    try {
                        Long pId = Long.parseLong(pIdStr.trim());
                        com.growgenie.app.entity.PlatformProduct p = platformProductRepository.findById(pId).orElse(null);
                        if (p != null) {
                            com.growgenie.app.entity.Order order = new com.growgenie.app.entity.Order();
                            order.setUserId(userId);
                            order.setItemType("product");
                            order.setItemId(pId);
                            order.setAmount(p.getPrice());
                            order.setPaymentId(paymentId);
                            order.setCreatedAt(java.time.LocalDateTime.now());
                            orderRepository.save(order);
                        }
                    } catch (Exception ex) {
                        // ignore malformed product ids
                    }
                }
                response.put("status", "success");
                response.put("message", "Product purchase verified.");
            } else {
                response.put("status", "error");
                response.put("message", "No product IDs provided.");
            }
        } else {
            response.put("status", "error");
            response.put("message", "Unknown purchase type.");
        }
        return response;
    }

    @GetMapping({"/voice_assistant"})
    public String voiceAssistant() {
        return "voice_assistant";
    }
}
