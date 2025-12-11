package com.TeamC.SmartDeliveryRoute.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.Instant;

@Document(collection = "telemetry")
public class Telemetry {
    @Id
    private String id;

    @NotBlank
    @Indexed
    private String vehicleId;

    @NotNull
    @Indexed
    private Instant timestamp;

    @NotNull
    private GeoPoint location;

    @PositiveOrZero
    private double speed;

    @Min(0) @Max(100)
    private int fuelLevel;

    @NotBlank
    private String status;

    public String getId(){
        return id;
    }

    public void setId(String id){
        this.id = id;
    }

    public String getVehicleId(){
        return vehicleId;
    }

    public void setVehicleId(String vehicleId){
        this.vehicleId = vehicleId;
    }

    public Instant getTimestamp(){
        return timestamp;
    }

    public void setTimestamp(Instant timestamp){
        this.timestamp = timestamp;
    }

    public GeoPoint getLocation(){
        return location;
    }

    public void setLocation(GeoPoint location){
        this.location = location;
    }

    public double getSpeed(){
        return speed;
    }

    public void setSpeed(double speed){
        this.speed = speed;
    }

    public int getFuelLevel(){
        return fuelLevel;
    }

    public void setFuelLevel(int fuelLevel){
        this.fuelLevel = fuelLevel;
    }

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
