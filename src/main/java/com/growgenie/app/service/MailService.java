package com.growgenie.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendMail(String to, String subject, String body) throws Exception {
        return sendMailWithAttachment(to, subject, body, null, null);
    }

    public boolean sendMailWithAttachment(String to, String subject, String body, String attachmentFilename, byte[] attachmentData) throws Exception {
        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> payload = new HashMap<>();
        
        // Sender info
        Map<String, String> sender = new HashMap<>();
        sender.put("name", "GrowGenie");
        sender.put("email", "adzitech@gmail.com");
        payload.put("sender", sender);

        // Recipient info
        Map<String, String> recipient = new HashMap<>();
        recipient.put("email", to);
        payload.put("to", Collections.singletonList(recipient));

        payload.put("subject", subject);
        payload.put("htmlContent", body);

        if (attachmentFilename != null && attachmentData != null) {
            Map<String, Object> attachment = new HashMap<>();
            attachment.put("name", attachmentFilename);
            // Brevo expects Base64 encoded attachment content
            String base64Content = Base64.getEncoder().encodeToString(attachmentData);
            attachment.put("content", base64Content);
            payload.put("attachment", Collections.singletonList(attachment));
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return true;
        } else {
            throw new RuntimeException("Brevo API failed with status: " + response.getStatusCode() + ", response: " + response.getBody());
        }
    }
}
