package com.growgenie.app.model;

public class Competitor {
    private String name;
    private String displayName;
    private String address;
    private String city;
    private String state;
    private String category;
    private double distance; // in meters

    public Competitor() {
    }

    public Competitor(String name, String displayName, String address, String city, String state, String category, double distance) {
        this.name = name;
        this.displayName = displayName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.category = category;
        this.distance = distance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}
