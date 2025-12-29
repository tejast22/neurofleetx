package com.smartdelivery.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate; // <--- THIS WAS MISSING

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id; // Keep it simple. MongoDB will handle the unique ID.

    private String customer;
    private String location; // Address text
    private String status;   // "Pending", "Assigned", "Delivered"
    private String driver;   // Name of the driver
    private String eta;
    private double price;

    // Map Coordinates
    private double destLat;
    private double destLng;

    // Dates for Reports
    private LocalDate orderDate;    // When order was created
    private LocalDate deliveryDate; // When order was finished

    private String distance;
}