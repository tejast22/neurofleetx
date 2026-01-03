package com.smartdelivery.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String item;
    private String customer;
    private String location;
    private String status;
    private String driver;
    private double price;

    // Coordinates
    private double destLat;
    private double destLng;

    // The new field for Analytics
    private LocalDate deliveryDate;
}