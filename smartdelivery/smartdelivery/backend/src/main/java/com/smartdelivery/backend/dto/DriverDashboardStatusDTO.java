package com.smartdelivery.backend.dto;
import lombok.Data;

@Data
public class DriverDashboardStatusDTO {
    private String deliveryMan;
    private String phone;
    private String vehicle;
    private int completedToday;
    private int pendingToday;
    private String trafficLevel;
    private String avgSpeed;
    private String totalDistance;
}