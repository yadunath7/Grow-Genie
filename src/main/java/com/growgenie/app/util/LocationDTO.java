package com.growgenie.app.util;

import lombok.Data;

@Data
public class LocationDTO {
    private String country;
    private String state;
    private String city;
    private Double latitude;
    private Double longitude;
}
