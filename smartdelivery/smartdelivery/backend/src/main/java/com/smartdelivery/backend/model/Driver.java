package com.smartdelivery.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drivers")
public class Driver {
    @Id
    private String id;

    private String name;

    // ✅ REQUIRED FIELDS (For Login & AdminController)
    private String email;
    private String password;

    private String vehicle;
    private String phone;
    private String status; // "Available", "Offline", "Busy"
    private String license;

    // ✅ REQUIRED FIELDS (For Location Tracking)
    // Default values set to avoid errors if location is missing
    private double currentLat = 23.0225;
    private double currentLng = 72.5714;
}