package com.smartdelivery.backend.service;

import com.smartdelivery.backend.model.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    // ✅ UPDATED: Accepts List<Order> to match AdminController
    public String generateDriverReport(String driverName, List<Order> orders) {
        RestTemplate restTemplate = new RestTemplate();

        // Calculate Stats for AI Context
        long total = orders.size();
        long delivered = orders.stream().filter(o -> "Delivered".equalsIgnoreCase(o.getStatus())).count();
        double earnings = orders.stream().filter(o -> "Delivered".equalsIgnoreCase(o.getStatus())).mapToDouble(Order::getPrice).sum();

        // Prompt Engineering
        String prompt = String.format(
                "Analyze the performance of driver %s. " +
                        "They have delivered %d out of %d assigned orders. " +
                        "Total earnings generated: $%.2f. " +
                        "Provide a short, professional performance review (max 3 sentences) focusing on efficiency and earnings.",
                driverName, delivered, total, earnings
        );

        // JSON Request Body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.1-8b-instant"); // ✅ Use this one

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        requestBody.put("messages", new Object[]{userMessage});

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        } catch (Exception e) {
            return "AI Analysis Unavailable: " + e.getMessage();
        }
        return "No Data";
    }
}