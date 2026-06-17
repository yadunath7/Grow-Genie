package com.growgenie.controller;

import com.growgenie.model.Invoice;
import com.growgenie.model.User;
import com.growgenie.repository.InvoiceRepository;
import com.growgenie.repository.UserRepository;
import com.growgenie.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        Long userId = getCurrentUserId();
        List<Invoice> history = invoiceRepository.findAllByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(Map.of("status", "success", "data", history));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Invoice invoice) {
        invoice.setUserId(getCurrentUserId());
        invoiceRepository.save(invoice);
        
        // Integrate Email Service hook here
        if (invoice.getRecipientEmail() != null && !invoice.getRecipientEmail().isEmpty()) {
            String clientName = invoice.getClientName();
            String amount = invoice.getAmount() != null ? invoice.getAmount().toString() : "0.00";
            String date = invoice.getDate() != null ? invoice.getDate().toString() : "";
            String status = invoice.getStatus();
            
            String subject = "New Invoice from GrowGenie";
            String body = "Mime-Version: 1.0\r\nContent-Type: text/html; charset=utf-8\r\n\r\n"
                        + "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;'>"
                        + "<h2 style='color: #191a23;'>Hello " + clientName + ",</h2>"
                        + "<p>A new invoice has been generated for you.</p>"
                        + "<table style='width: 100%; border-collapse: collapse;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Amount:</td><td style='padding: 8px;'>₹" + amount + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Date:</td><td style='padding: 8px;'>" + date + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + status + "</td></tr>"
                        + "</table>"
                        + "<p>Please log in to your account or contact us for more details.</p>"
                        + "<hr>"
                        + "<p style='font-size: 12px; color: #888;'>Generated via GrowGenie</p>"
                        + "</div>";
            
            emailService.sendHtmlMail(invoice.getRecipientEmail(), subject, body);
        }
        
        return ResponseEntity.ok(Map.of("status", "success", "message", "Invoice saved and email sent.", "id", invoice.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        if (!invoice.getUserId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).body(Map.of("status", "error", "message", "Forbidden"));
        }

        invoice.setStatus(body.get("status"));
        invoiceRepository.save(invoice);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails)principal).getUsername() : principal.toString();
        return userRepository.findByEmail(email).get().getId();
    }
}
