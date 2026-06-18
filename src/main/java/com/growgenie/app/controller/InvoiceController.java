package com.growgenie.app.controller;

import com.growgenie.app.entity.Invoice;
import com.growgenie.app.repository.InvoiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private com.growgenie.app.service.MailService mailService;

    @RequestMapping(value = "/invoices", method = {RequestMethod.GET, RequestMethod.POST})
    public Map<String, Object> handleInvoices(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String client_name,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long invoice_id,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String gst_number,
            @RequestParam(required = false) String recipient_email,
            @RequestParam(required = false) String pdf_base64,
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
            List<Invoice> invoices = invoiceRepository.findByUserId(userId);
            response.put("status", "success");
            response.put("data", invoices);
            return response;

        } else if ("save".equals(action)) {
            try {
                Invoice inv = new Invoice();
                inv.setUserId(userId);
                inv.setClientName(client_name);
                inv.setAmount(Double.parseDouble(amount != null ? amount : "0"));
                if (date != null && !date.isEmpty()) {
                    inv.setDate(java.time.LocalDate.parse(date));
                }
                inv.setGstNumber(gst_number);
                inv.setRecipientEmail(recipient_email);
                inv.setStatus(status != null ? status : "pending");
                inv.setCreatedAt(LocalDateTime.now());
                invoiceRepository.save(inv);

                if (recipient_email != null && !recipient_email.isEmpty()) {
                    String subject = "New Invoice from GrowGenie";
                    String body = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;'>"
                            + "<h2 style='color: #191a23;'>Hello " + client_name + ",</h2>"
                            + "<p>A new invoice has been generated for you.</p>"
                            + "<table style='width: 100%; border-collapse: collapse;'>"
                            + "<tr><td style='padding: 8px; font-weight: bold;'>Amount:</td><td style='padding: 8px;'>₹" + amount + "</td></tr>"
                            + "<tr><td style='padding: 8px; font-weight: bold;'>Date:</td><td style='padding: 8px;'>" + date + "</td></tr>"
                            + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + inv.getStatus() + "</td></tr>"
                            + "</table>"
                            + "<p>Please log in to your account or contact us for more details.</p>"
                            + "<hr><p style='font-size: 12px; color: #888;'>Generated via GrowGenie</p></div>";
                    
                    byte[] pdfBytes = null;
                    if (pdf_base64 != null && !pdf_base64.isEmpty()) {
                        try {
                            String base64Data = pdf_base64.contains(",") ? pdf_base64.split(",")[1] : pdf_base64;
                            pdfBytes = java.util.Base64.getDecoder().decode(base64Data);
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    }

                    if (pdfBytes != null) {
                        try {
                            mailService.sendMailWithAttachment(recipient_email, subject, body, "Invoice_" + client_name.replaceAll("\\s+", "_") + ".pdf", pdfBytes);
                        } catch (Exception mailEx) {
                            System.err.println("Email failed (likely blocked by Railway firewall): " + mailEx.getMessage());
                            response.put("status", "success");
                            response.put("message", "Invoice generated and saved! Note: Auto-email was blocked by the cloud server. You can attach the downloaded PDF manually.");
                            return response;
                        }
                    } else {
                        try {
                            mailService.sendMail(recipient_email, subject, body);
                        } catch (Exception mailEx) {
                            System.err.println("Email failed: " + mailEx.getMessage());
                        }
                    }
                }

                response.put("status", "success");
                response.put("message", "Invoice created and emailed successfully.");
                return response;
            } catch (Exception e) {
                e.printStackTrace();
                response.put("status", "error");
                response.put("message", "Backend Error: " + e.getMessage());
                return response;
            }
            
        } else if ("update_status".equals(action)) {
            if (invoice_id != null) {
                Invoice inv = invoiceRepository.findById(invoice_id).orElse(null);
                if (inv != null && inv.getUserId().equals(userId)) {
                    inv.setStatus(status);
                    invoiceRepository.save(inv);
                    response.put("status", "success");
                    response.put("message", "Invoice updated.");
                    return response;
                }
            }
        }

        response.put("status", "error");
        response.put("message", "Invalid action.");
        return response;
    }
}
