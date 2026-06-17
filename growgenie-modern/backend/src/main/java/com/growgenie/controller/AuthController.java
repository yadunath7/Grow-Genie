package com.growgenie.controller;

import com.growgenie.model.PasswordReset;
import com.growgenie.model.User;
import com.growgenie.repository.PasswordResetRepository;
import com.growgenie.repository.UserRepository;
import com.growgenie.security.jwt.JwtUtils;
import com.growgenie.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordResetRepository passwordResetRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // Admin hardcoded credentials bypass if requested (matches legacy auth.php)
        if ("admin@growgenie.com".equalsIgnoreCase(email) && "yadu@123".equals(password)) {
            // Check if admin user exists in DB first
            Optional<User> adminOpt = userRepository.findByEmail("admin@growgenie.com");
            User adminUser;
            if (adminOpt.isEmpty()) {
                adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setEmail("admin@growgenie.com");
                adminUser.setPassword(encoder.encode("yadu@123"));
                adminUser.setSubscriptionStatus("active");
                adminUser.setTrialEndDate(LocalDate.now().plusYears(10));
                userRepository.save(adminUser);
            } else {
                adminUser = adminOpt.get();
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        User user = userRepository.findByEmail(email).get();

        // Expire trial if past trial end date
        if ("trial".equals(user.getSubscriptionStatus()) && LocalDate.now().isAfter(user.getTrialEndDate())) {
            user.setSubscriptionStatus("expired");
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of(
            "token", jwt,
            "accessToken", jwt,
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "subscriptionStatus", user.getSubscriptionStatus()
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.get("name"));
        user.setEmail(signUpRequest.get("email"));
        user.setPassword(encoder.encode(signUpRequest.get("password")));
        user.setTrialEndDate(LocalDate.now().plusDays(5));
        user.setSubscriptionStatus("trial");

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails)principal).getUsername() : principal.toString();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "user", Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "subscription_status", user.getSubscriptionStatus(),
                    "trial_end_date", user.getTrialEndDate().toString()
                )
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Unauthorized"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Email is required."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Email not found."));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // Clear and save new OTP
        PasswordReset reset = new PasswordReset();
        reset.setEmail(email);
        reset.setOtp(otp);
        reset.setCreatedAt(LocalDateTime.now());
        passwordResetRepository.save(reset);

        String subject = "Your GrowGenie OTP for Password Reset";
        String body = "Mime-Version: 1.0\r\nContent-Type: text/html; charset=utf-8\r\n\r\n"
                    + "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                    + "<h2>Password Reset Request</h2>"
                    + "<p>Hello,</p>"
                    + "<p>We received a request to reset your password. Use the following OTP to proceed:</p>"
                    + "<div style='font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 15px; display: inline-block; border-radius: 10px; border: 2px solid #191a23;'>" + otp + "</div>"
                    + "<p>This OTP is valid for 5 minutes.</p>"
                    + "<p>If you didn't request this, please ignore this email.</p>"
                    + "</div>";

        if (emailService.sendHtmlMail(email, subject, body)) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "OTP sent to your email."));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Failed to send email."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Email and OTP are required."));
        }

        Optional<PasswordReset> resetOpt = passwordResetRepository.findByEmailAndOtp(email, otp);
        if (resetOpt.isPresent()) {
            PasswordReset reset = resetOpt.get();
            if (reset.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
                return ResponseEntity.ok(Map.of("status", "success", "message", "OTP verified."));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Invalid or expired OTP."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "All fields are required."));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Password must be at least 6 characters."));
        }

        Optional<PasswordReset> resetOpt = passwordResetRepository.findByEmailAndOtp(email, otp);
        if (resetOpt.isEmpty() || resetOpt.get().getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(5))) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Unauthorized or link expired."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(encoder.encode(newPassword));
            userRepository.save(user);

            // Clear OTP
            passwordResetRepository.delete(resetOpt.get());

            return ResponseEntity.ok(Map.of("status", "success", "message", "Password reset successfully! You can now login."));
        }

        return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "User not found."));
    }
}
