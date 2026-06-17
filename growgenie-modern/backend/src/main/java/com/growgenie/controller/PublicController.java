package com.growgenie.controller;

import com.growgenie.repository.TeamMemberRepository;
import com.growgenie.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @GetMapping("/testimonials")
    public ResponseEntity<?> getTestimonials() {
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", testimonialRepository.findAll()
        ));
    }

    @GetMapping("/team-members")
    public ResponseEntity<?> getTeamMembers() {
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", teamMemberRepository.findAll()
        ));
    }
}
