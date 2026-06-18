package com.growgenie.app.controller;

import com.growgenie.app.entity.*;
import com.growgenie.app.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private PlatformProductRepository platformProductRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private com.growgenie.app.service.SettingsService settingsService;

    private boolean isAdmin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && Boolean.TRUE.equals(session.getAttribute("admin_logged_in"))) {
            return true;
        }
        return false;
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpServletRequest request, Model model) {
        if (!isAdmin(request)) return "redirect:/login";

        long totalUsers = userRepository.count();
        long totalIdeas = ideaRepository.count();
        long premiumUsers = userRepository.countBySubscriptionStatus("active");
        
        Double profit = orderRepository.calculateTotalProfit();
        if (profit == null) profit = 0.0;

        model.addAttribute("total_users", totalUsers);
        model.addAttribute("total_ideas", totalIdeas);
        model.addAttribute("premium_users", premiumUsers);
        model.addAttribute("admin_profit", profit);

        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String users(HttpServletRequest request, Model model) {
        if (!isAdmin(request)) return "redirect:/login";
        model.addAttribute("users", userRepository.findAll());
        return "admin/users";
    }

    @PostMapping("/users/update_status")
    public String updateUserStatus(HttpServletRequest request, @RequestParam Long user_id, @RequestParam String status) {
        if (!isAdmin(request)) return "redirect:/login";
        com.growgenie.app.entity.User user = userRepository.findById(user_id).orElse(null);
        if (user != null) {
            user.setSubscriptionStatus(status);
            userRepository.save(user);
        }
        return "redirect:/admin/users";
    }

    @GetMapping("/users/delete")
    public String deleteUser(HttpServletRequest request, @RequestParam Long id) {
        if (!isAdmin(request)) return "redirect:/login";
        userRepository.deleteById(id);
        return "redirect:/admin/users";
    }

    @GetMapping("/subscriptions")
    public String subscriptions(HttpServletRequest request, Model model, @RequestParam(required = false) Long delete) {
        if (!isAdmin(request)) return "redirect:/login";
        if (delete != null) {
            subscriptionPlanRepository.deleteById(delete);
            return "redirect:/admin/subscriptions";
        }
        model.addAttribute("plans", subscriptionPlanRepository.findAll());
        return "admin/subscriptions";
    }

    @PostMapping("/subscriptions")
    public String addSubscription(HttpServletRequest request, @RequestParam String name, @RequestParam Double price, @RequestParam String badge_text, @RequestParam String duration_text, @RequestParam String features) {
        if (!isAdmin(request)) return "redirect:/login";
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(name);
        plan.setPrice(price);
        plan.setBadgeText(badge_text);
        plan.setDurationText(duration_text);
        plan.setFeatures(features);
        plan.setCreatedAt(LocalDateTime.now());
        subscriptionPlanRepository.save(plan);
        return "redirect:/admin/subscriptions";
    }

    // --- PLATFORM PRODUCTS ---

    @GetMapping("/platform_products")
    public String platformProducts(HttpServletRequest request, Model model, @RequestParam(required = false) Long delete) {
        if (!isAdmin(request)) return "redirect:/login";
        if (delete != null) {
            platformProductRepository.deleteById(delete);
            return "redirect:/admin/platform_products";
        }
        model.addAttribute("products", platformProductRepository.findAll());
        return "admin/platform_products";
    }

    @PostMapping("/platform_products")
    public String addPlatformProduct(HttpServletRequest request, @RequestParam String name, @RequestParam Double price, @RequestParam String rate_type, @RequestParam String duration, @RequestParam String description, @RequestParam("image") MultipartFile image) throws IOException {
        if (!isAdmin(request)) return "redirect:/login";
        PlatformProduct product = new PlatformProduct();
        product.setName(name);
        product.setPrice(price);
        product.setRateType(rate_type);
        product.setDuration(duration);
        product.setDescription(description);
        product.setCreatedAt(LocalDateTime.now());
        
        if (!image.isEmpty()) {
            String uploadDir = "src/main/resources/static/uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath);
            product.setImageUrl("/uploads/" + filename);
        } else {
            product.setImageUrl("");
        }

        platformProductRepository.save(product);
        return "redirect:/admin/platform_products";
    }

    // --- TESTIMONIALS ---

    @GetMapping("/testimonials")
    public String testimonials(HttpServletRequest request, Model model, @RequestParam(required = false) Long delete) {
        if (!isAdmin(request)) return "redirect:/login";
        if (delete != null) {
            testimonialRepository.deleteById(delete);
            return "redirect:/admin/testimonials";
        }
        model.addAttribute("testimonials", testimonialRepository.findAll());
        return "admin/testimonials";
    }

    @PostMapping("/testimonials")
    public String addTestimonial(HttpServletRequest request, @RequestParam String name, @RequestParam String role, @RequestParam String content) {
        if (!isAdmin(request)) return "redirect:/login";
        Testimonial t = new Testimonial();
        t.setName(name);
        t.setRole(role);
        t.setContent(content);
        t.setCreatedAt(LocalDateTime.now());
        testimonialRepository.save(t);
        return "redirect:/admin/testimonials";
    }

    // --- TEAM MEMBERS ---

    @GetMapping("/team")
    public String team(HttpServletRequest request, Model model, @RequestParam(required = false) Long delete) {
        if (!isAdmin(request)) return "redirect:/login";
        if (delete != null) {
            teamMemberRepository.deleteById(delete);
            return "redirect:/admin/team";
        }
        model.addAttribute("teamMembers", teamMemberRepository.findAll());
        return "admin/team";
    }

    @PostMapping("/team")
    public String addTeamMember(HttpServletRequest request, @RequestParam String name, @RequestParam String position, @RequestParam String linkedin_url, @RequestParam String description, @RequestParam("image") MultipartFile image) throws IOException {
        if (!isAdmin(request)) return "redirect:/login";
        
        TeamMember member = new TeamMember();
        member.setName(name);
        member.setPosition(position);
        member.setLinkedinUrl(linkedin_url);
        member.setDescription(description);
        member.setCreatedAt(LocalDateTime.now());

        if (!image.isEmpty()) {
            String uploadDir = "src/main/resources/static/uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath);
            member.setImageUrl("/uploads/" + filename);
        } else {
            member.setImageUrl("");
        }

        teamMemberRepository.save(member);
        return "redirect:/admin/team";
    }

    @GetMapping("/settings")
    public String settings(HttpServletRequest request, Model model, @RequestParam(required = false) String success) {
        if (!isAdmin(request)) return "redirect:/login";
        model.addAttribute("settings", settingsService.getAllSettings());
        if (success != null) {
            model.addAttribute("success_msg", "Settings updated successfully!");
        }
        return "admin/settings";
    }

    @PostMapping("/settings")
    public String updateSettings(HttpServletRequest request, @RequestParam java.util.Map<String, String> allParams) {
        if (!isAdmin(request)) return "redirect:/login";
        for (java.util.Map.Entry<String, String> entry : allParams.entrySet()) {
            String key = entry.getKey();
            if (key.equals("success") || key.equals("delete")) continue; // avoid internal params
            settingsService.updateSetting(key, entry.getValue());
        }
        return "redirect:/admin/settings?success=1";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return "redirect:/login";
    }
}
