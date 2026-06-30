package com.growgenie.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Data
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "ip_address")
    private String ipAddress;

    private String country;
    
    private String state;
    
    private String city;
    
    private Double latitude;
    
    private Double longitude;

    private String browser;
    
    @Column(name = "operating_system")
    private String operatingSystem;
    
    @Column(name = "device_type")
    private String deviceType;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;
}
