package com.growgenie.app.controller;

import com.growgenie.app.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalControllerAdvice {

    @Autowired
    private SettingsService settingsService;

    @Autowired
    private jakarta.servlet.http.HttpServletRequest request;

    @Autowired
    private com.growgenie.app.repository.UserRepository userRepository;

    private String getCurrentTheme() {
        jakarta.servlet.http.HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user_id") != null) {
            Long userId = (Long) session.getAttribute("user_id");
            if (userId != 0L) { // not admin
                com.growgenie.app.entity.User user = userRepository.findById(userId).orElse(null);
                if (user != null && user.getTheme() != null) {
                    return user.getTheme();
                }
            }
        }
        return settingsService.getSetting("ui_theme", "classic");
    }

    @ModelAttribute
    public void addThemeAttributes(org.springframework.ui.Model model) {
        String theme = getCurrentTheme();
        String primary, secondary, filter;
        switch (theme) {
            case "ocean_blue": 
                primary = "#00f2fe"; secondary = "#0f172a"; filter = "hue-rotate(95deg)"; break;
            case "cyberpunk": 
                primary = "#c084fc"; secondary = "#09090b"; filter = "hue-rotate(182deg)"; break;
            case "sunset": 
                primary = "#fb923c"; secondary = "#1c1917"; filter = "hue-rotate(299deg)"; break;
            case "ruby_red": 
                primary = "#ef4444"; secondary = "#450a0a"; filter = "hue-rotate(272deg)"; break;
            default: 
                primary = "#b9ff66"; secondary = "#191a23"; filter = "hue-rotate(0deg)"; break;
        }
        model.addAttribute("theme_primary", primary);
        model.addAttribute("theme_secondary", secondary);
        model.addAttribute("theme_filter", filter);
    }
}
