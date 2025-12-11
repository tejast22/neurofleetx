package com.TeamC.SmartDeliveryRoute.model;

import jakarta.validation.constraints.NotNull;

public class GeoPoint {
    @NotNull
    private String type = "Point";
    @NotNull
    private double[] coordinates;

    public GeoPoint(){}
    public GeoPoint(double longitude,double latitude){
        this.type = "Point";
        this.coordinates = new double[]{longitude,latitude};
    }

    public String getType() {
        return type;
    }

    public double[] getCoordinates(){
        return coordinates;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setcoordinates(double[] coordinates){
        this.coordinates = coordinates;
    }
}

