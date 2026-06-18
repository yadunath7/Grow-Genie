package com.growgenie.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendMail(String to, String subject, String body) throws Exception {
        return sendMailWithAttachment(to, subject, body, null, null);
    }

    public boolean sendMailWithAttachment(String to, String subject, String body, String attachmentFilename, byte[] attachmentData) throws Exception {
        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + resendApiKey);

        Map<String, Object> payload = new HashMap<>();
        // Resend free tier requires sending from a verified domain or "onboarding@resend.dev"
        // Let's send from onboarding@resend.dev, but we can reply-to adzitech@gmail.com
        payload.put("from", "onboarding@resend.dev");
        payload.put("to", to);
        payload.put("subject", subject);
        payload.put("html", body);
        
        List<Map<String, String>> replyTo = new ArrayList<>();
        Map<String, String> replyToMap = new HashMap<>();
        replyToMap.put("email", "adzitech@gmail.com");
        payload.put("reply_to", "adzitech@gmail.com");

        if (attachmentFilename != null && attachmentData != null) {
            Map<String, Object> attachment = new HashMap<>();
            attachment.put("filename", attachmentFilename);
            // Resend attachments requires standard Base64 encoding of content bytes
            String base64Content = Base64.getEncoder().encodeToString(attachmentData);
            attachment.put("content", base64Content);
            payload.put("attachments", Collections.singletonList(attachment));
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return true;
        } else {
            throw new RuntimeException("Resend API failed with status: " + response.getStatusCode() + ", response: " + response.getBody());
        }
    }
}
