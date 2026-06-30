package com.growgenie.app.controller;

import com.growgenie.app.entity.LoginHistory;
import com.growgenie.app.service.LoginHistoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class LoginHistoryController {

    private final LoginHistoryService loginHistoryService;

    @Autowired
    public LoginHistoryController(LoginHistoryService loginHistoryService) {
        this.loginHistoryService = loginHistoryService;
    }

    // JSON API as requested
    @GetMapping("/api/login-history")
    @ResponseBody
    public List<LoginHistory> getLoginHistoryApi(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user_id") != null) {
            Long userId = (Long) session.getAttribute("user_id");
            return loginHistoryService.getUserLoginHistory(userId);
        }
        return List.of();
    }

    // Thymeleaf View Page
    @GetMapping("/profile/login-history")
    public String loginHistoryPage(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            return "redirect:/login";
        }

        Long userId = (Long) session.getAttribute("user_id");
        List<LoginHistory> history = loginHistoryService.getUserLoginHistory(userId);
        
        model.addAttribute("loginHistory", history);
        return "login_history";
    }
}
