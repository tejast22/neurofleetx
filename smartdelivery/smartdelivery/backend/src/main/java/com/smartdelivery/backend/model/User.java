package com.smartdelivery.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password; // In real app, this should be encrypted
    private String role;     // "ADMIN" or "DRIVER"
    private String vehicle;  // Only for Drivers
    private String status;  // "Active", "Pending"
    private String phone;

    // Coordinates (for Drivers)
    private double currentLat;
    private double currentLng;
}