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

    @ModelAttribute("theme_primary")
    public String getThemePrimary() {
        String theme = getCurrentTheme();
        switch (theme) {
            case "ocean_blue": return "#00f2fe";
            case "cyberpunk": return "#c084fc";
            case "sunset": return "#fb923c";
            case "ruby_red": return "#ef4444";
            default: return "#b9ff66";
        }
    }

    @ModelAttribute("theme_secondary")
    public String getThemeSecondary() {
        String theme = getCurrentTheme();
        switch (theme) {
            case "ocean_blue": return "#0f172a";
            case "cyberpunk": return "#09090b";
            case "sunset": return "#1c1917";
            case "ruby_red": return "#450a0a";
            default: return "#191a23";
        }
    }

    @ModelAttribute("theme_filter")
    public String getThemeFilter() {
        String theme = getCurrentTheme();
        switch (theme) {
            case "ocean_blue": return "hue-rotate(95deg)";
            case "cyberpunk": return "hue-rotate(182deg)";
            case "sunset": return "hue-rotate(299deg)";
            case "ruby_red": return "hue-rotate(272deg)";
            default: return "hue-rotate(0deg)";
        }
    }
}
