package com.growgenie.app.controller;

import com.growgenie.app.entity.BusinessProfile;
import com.growgenie.app.repository.BusinessProfileRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BusinessProfileController {

    @Autowired
    private BusinessProfileRepository businessProfileRepository;

    @RequestMapping(value = "/business_profile", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> handleBusinessProfile(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String company_name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String contact_details,
            @RequestParam(required = false) String existing_logo,
            @RequestParam(required = false) String existing_stamp,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            @RequestParam(value = "stamp", required = false) MultipartFile stampFile,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("user_id") == null) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        Long userId = (Long) session.getAttribute("user_id");

        if ("fetch".equals(action)) {
            List<BusinessProfile> profiles = businessProfileRepository.findByUserId(userId);
            if (!profiles.isEmpty()) {
                response.put("status", "success");
                response.put("data", profiles.get(0));
            } else {
                response.put("status", "success");
                response.put("data", null);
            }
            return response;
        } else if ("save".equals(action)) {
            String uploadDir = "src/main/resources/static/uploads/profiles/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String logoPath = existing_logo != null ? existing_logo : "";
            if (logoFile != null && !logoFile.isEmpty()) {
                try {
                    String logoName = "logo_" + userId + "_" + System.currentTimeMillis() + "_" + logoFile.getOriginalFilename();
                    Path path = Paths.get(uploadDir + logoName);
                    Files.write(path, logoFile.getBytes());
                    logoPath = "uploads/profiles/" + logoName;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            String stampPath = existing_stamp != null ? existing_stamp : "";
            if (stampFile != null && !stampFile.isEmpty()) {
                try {
                    String stampName = "stamp_" + userId + "_" + System.currentTimeMillis() + "_" + stampFile.getOriginalFilename();
                    Path path = Paths.get(uploadDir + stampName);
                    Files.write(path, stampFile.getBytes());
                    stampPath = "uploads/profiles/" + stampName;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            List<BusinessProfile> profiles = businessProfileRepository.findByUserId(userId);
            BusinessProfile profile;
            if (!profiles.isEmpty()) {
                profile = profiles.get(0);
            } else {
                profile = new BusinessProfile();
                profile.setUserId(userId);
            }

            profile.setCompanyName(company_name);
            profile.setLogoPath(logoPath);
            profile.setStampPath(stampPath);
            profile.setAddress(address);
            profile.setContactDetails(contact_details);
            businessProfileRepository.save(profile);

            response.put("status", "success");
            response.put("message", "Profile updated successfully.");
            response.put("logo", logoPath);
            response.put("stamp", stampPath);
            return response;
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
