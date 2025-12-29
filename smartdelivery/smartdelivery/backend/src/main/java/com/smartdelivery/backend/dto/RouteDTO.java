package com.smartdelivery.backend.dto;
import lombok.Data;
import java.util.List;

@Data
public class RouteDTO {
    private String totalDistance;
    private String estimatedTime;
    private int stops;
    private List<RouteStep> routePoints;

    @Data
    public static class RouteStep {
        private int step;
        private String location;
        private String address;
    }
}