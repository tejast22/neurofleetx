package com.smartdelivery.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "drivers")
public class Driver {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String vehicleType;
    private String licenseNumber;
    private String status; // "Available", "Busy", "Offline"

    // ✅ Added this to fix the AuthController error
    private String password;

    // For Live Tracking
    private double currentLat;
    private double currentLng;
}