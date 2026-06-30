package com.growgenie.app.controller;

import com.growgenie.app.entity.User;
import com.growgenie.app.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.growgenie.app.service.SettingsService settingsService;

    @Autowired
    private com.growgenie.app.service.LoginHistoryService loginHistoryService;

    @RequestMapping(value = "/auth", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> authHandler(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        if ("register".equals(action)) {
            if (name == null || email == null || password == null) {
                response.put("status", "error");
                response.put("message", "All fields are required.");
                return response;
            }

            if (userRepository.findByEmail(email) != null) {
                response.put("status", "error");
                response.put("message", "Email already exists.");
                return response;
            }

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setTrialEndDate(LocalDate.now().plusDays(5));
            user.setSubscriptionStatus("trial");
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);

            response.put("status", "success");
            response.put("message", "Registration successful.");
            return response;

        } else if ("login".equals(action)) {
            if (email == null || password == null) {
                response.put("status", "error");
                response.put("message", "Email and password required.");
                return response;
            }

            if ("admin@growgenie.com".equalsIgnoreCase(email) && "yadu@123".equals(password)) {
                HttpSession session = request.getSession();
                session.setAttribute("admin_logged_in", true);
                session.setAttribute("user_id", 0L);
                session.setAttribute("user_name", "Admin");
                
                response.put("status", "success");
                response.put("message", "Admin login successful.");
                response.put("is_admin", true);
                return response;
            }

            User user = userRepository.findByEmail(email);
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                HttpSession session = request.getSession();
                session.setAttribute("user_id", user.getId());
                
                if ("trial".equals(user.getSubscriptionStatus()) && LocalDate.now().isAfter(user.getTrialEndDate())) {
                    user.setSubscriptionStatus("expired");
                    userRepository.save(user);
                }

                session.setAttribute("user_name", user.getName());
                session.setAttribute("subscription_status", user.getSubscriptionStatus());
                
                boolean isAdmin = "admin@growgenie.com".equalsIgnoreCase(user.getEmail());
                if (isAdmin) {
                    session.setAttribute("admin_logged_in", true);
                }

                response.put("status", "success");
                response.put("message", "Login successful.");
                response.put("is_admin", isAdmin);

                // Record login history asynchronously to avoid slowing down login
                new Thread(() -> {
                    loginHistoryService.recordLogin(user.getId(), request);
                }).start();
            } else {
                response.put("status", "error");
                response.put("message", "Invalid email or password.");
            }
            return response;

        } else if ("logout".equals(action)) {
            request.getSession().invalidate();
            response.put("status", "success");
            response.put("message", "Logged out.");
            return response;

        } else if ("check".equals(action)) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("user_id") != null) {
                Long userId = (Long) session.getAttribute("user_id");
                if (userId == 0L) {
                    Map<String, Object> adminUser = new HashMap<>();
                    adminUser.put("id", 0);
                    adminUser.put("name", "Admin");
                    adminUser.put("email", "admin@growgenie.com");
                    adminUser.put("subscription_status", "active");
                    adminUser.put("theme", settingsService.getSetting("ui_theme", "classic"));
                    response.put("status", "success");
                    response.put("user", adminUser);
                    return response;
                }
                
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("subscription_status", user.getSubscriptionStatus());
                    userMap.put("trial_end_date", user.getTrialEndDate());
                    userMap.put("theme", user.getTheme() != null ? user.getTheme() : "classic");

                    response.put("status", "success");
                    response.put("user", userMap);
                } else {
                    session.invalidate();
                    response.put("status", "error");
                    response.put("message", "User not found.");
                }
            } else {
                response.put("status", "error");
                response.put("message", "Not logged in.");
            }
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }

    @PostMapping("/user/update_theme")
    public Map<String, Object> updateTheme(@RequestParam String theme, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }
        Long userId = (Long) session.getAttribute("user_id");
        if (userId == 0L) { // Admin
            settingsService.updateSetting("ui_theme", theme);
            response.put("status", "success");
            response.put("message", "Global theme updated.");
            return response;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setTheme(theme);
            userRepository.save(user);
            response.put("status", "success");
            response.put("message", "Theme updated successfully.");
        } else {
            response.put("status", "error");
            response.put("message", "User not found.");
        }
        return response;
    }
}
