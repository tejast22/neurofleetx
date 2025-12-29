package com.smartdelivery.backend.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "inventory")
public class Inventory {
    @Id private String id;
    private String product;
    private int stock;
    private double price;
    private String status; // "In Stock", "Low Stock"
}