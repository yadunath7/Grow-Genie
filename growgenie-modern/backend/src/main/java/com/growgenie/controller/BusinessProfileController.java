package com.growgenie.controller;

import com.growgenie.model.BusinessProfile;
import com.growgenie.repository.BusinessProfileRepository;
import com.growgenie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/business-profile")
public class BusinessProfileController {

    @Autowired
    private BusinessProfileRepository businessProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProfile() {
        Long userId = getCurrentUserId();
        Optional<BusinessProfile> profileOpt = businessProfileRepository.findByUserId(userId);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", profileOpt.orElse(null)
        ));
    }

    @PostMapping
    public ResponseEntity<?> saveProfile(
            @RequestParam("companyName") String companyName,
            @RequestParam("address") String address,
            @RequestParam("contactDetails") String contactDetails,
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "stamp", required = false) MultipartFile stamp) {

        Long userId = getCurrentUserId();
        Optional<BusinessProfile> profileOpt = businessProfileRepository.findByUserId(userId);

        BusinessProfile profile = profileOpt.orElseGet(BusinessProfile::new);
        profile.setUserId(userId);
        profile.setCompanyName(companyName);
        profile.setAddress(address);
        profile.setContactDetails(contactDetails);

        String uploadDirStr = "../uploads/profiles/";
        File uploadDir = new File(uploadDirStr);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        try {
            if (logo != null && !logo.isEmpty()) {
                String logoFilename = "logo_" + userId + "_" + System.currentTimeMillis() + "_" + logo.getOriginalFilename();
                Path logoPath = Paths.get(uploadDirStr, logoFilename);
                Files.copy(logo.getInputStream(), logoPath);
                profile.setLogoPath("uploads/profiles/" + logoFilename);
            }

            if (stamp != null && !stamp.isEmpty()) {
                String stampFilename = "stamp_" + userId + "_" + System.currentTimeMillis() + "_" + stamp.getOriginalFilename();
                Path stampPath = Paths.get(uploadDirStr, stampFilename);
                Files.copy(stamp.getInputStream(), stampPath);
                profile.setStampPath("uploads/profiles/" + stampFilename);
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Failed to save logo or stamp: " + e.getMessage()
            ));
        }

        businessProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Profile updated successfully.",
            "data", profile
        ));
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails)principal).getUsername() : principal.toString();
        return userRepository.findByEmail(email).get().getId();
    }
}
