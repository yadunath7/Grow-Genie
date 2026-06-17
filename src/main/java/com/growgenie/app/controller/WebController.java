package com.growgenie.app.controller;

import com.growgenie.app.repository.TeamMemberRepository;
import com.growgenie.app.repository.TestimonialRepository;
import com.growgenie.app.repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @GetMapping({"/", "/index"})
    public String index(Model model) {
        model.addAttribute("testimonials", testimonialRepository.findAll());
        model.addAttribute("team_members", teamMemberRepository.findAll());
        return "index";
    }

    @GetMapping({"/about"})
    public String about() {
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
    public String profile() {
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

    @GetMapping({"/voice_assistant"})
    public String voiceAssistant() {
        return "voice_assistant";
    }
}
