package com.growgenie.app.util;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.City;
import com.maxmind.geoip2.record.Country;
import com.maxmind.geoip2.record.Location;
import com.maxmind.geoip2.record.Subdivision;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.InetAddress;

@Component
public class GeoIpUtils {

    private DatabaseReader dbReader;

    @PostConstruct
    public void init() {
        try {
            InputStream database = new ClassPathResource("GeoLite2-City.mmdb").getInputStream();
            dbReader = new DatabaseReader.Builder(database).build();
        } catch (Throwable e) {
            System.err.println("Failed to load GeoLite2-City database: " + e.getMessage());
        }
    }

    public LocationDTO getLocation(String ip) {
        LocationDTO locationDTO = new LocationDTO();
        if (dbReader == null || ip == null || ip.isEmpty() || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            return locationDTO; // Localhost or uninitialized
        }

        try {
            InetAddress ipAddress = InetAddress.getByName(ip);
            CityResponse response = dbReader.city(ipAddress);

            Country country = response.getCountry();
            if (country != null) {
                locationDTO.setCountry(country.getName());
            }

            Subdivision subdivision = response.getMostSpecificSubdivision();
            if (subdivision != null) {
                locationDTO.setState(subdivision.getName());
            }

            City city = response.getCity();
            if (city != null) {
                locationDTO.setCity(city.getName());
            }

            Location location = response.getLocation();
            if (location != null) {
                locationDTO.setLatitude(location.getLatitude());
                locationDTO.setLongitude(location.getLongitude());
            }
        } catch (Exception e) {
            // Address not found or parsing error, return empty DTO
        }

        return locationDTO;
    }
}
