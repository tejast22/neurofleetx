package com.TeamC.SmartDeliveryRoute.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "routes")
public class RoutePlan {
    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String routeId;

    @NotBlank
    @Indexed
    private String vehicleId;

    @NotNull
    private GeoPoint startLocation;

    @NotNull
    private GeoPoint endLocation;

    @NotNull
    private List<GeoPoint> waypoints;

    @Positive
    private int estimateTimeMinutes;

    @NotBlank
    private String status;

    public String getId(){
        return id;
    }

    public void setId(String id){
        this.id = id;
    }

    public String getRouteId(){
        return routeId;
    }

    public void setRouteId(String routeId){
        this.routeId = routeId;
    }

    public String getVehicleId(){
        return vehicleId;
    }

    public void setVehicleId(String vehicleId){
        this.vehicleId = vehicleId;
    }

    public GeoPoint getStartLocation(){
        return startLocation;
    }

    public void setStartLocation(GeoPoint startLocation){
        this.startLocation = startLocation;
    }

    public GeoPoint getEndLocation(){
        return endLocation;
    }

    public void setEndLocation(GeoPoint endLocation){
        this.endLocation = endLocation;
    }

    public List<GeoPoint> getWaypoints(){
        return waypoints;
    }

    public void setWaypoints(List<GeoPoint> wayPoints){
        this.waypoints = waypoints;
    }

    public int getEstimateTimeMinutes(){
        return estimateTimeMinutes;
    }

    public void setEstimateTimeMinutes(int estimateTimeMinutes){
        this.estimateTimeMinutes = estimateTimeMinutes;
    }

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
