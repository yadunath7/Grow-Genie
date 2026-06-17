package com.growgenie.app.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "business_profile")
public class BusinessProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonProperty("user_id")
    private Long userId;
    
    @JsonProperty("company_name")
    private String companyName;
    
    @JsonProperty("logo_path")
    private String logoPath;
    
    @JsonProperty("stamp_path")
    private String stampPath;
    
    @Lob
    private String address;
    
    @JsonProperty("contact_details")
    private String contactDetails;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public String getStampPath() {
        return stampPath;
    }

    public void setStampPath(String stampPath) {
        this.stampPath = stampPath;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactDetails() {
        return contactDetails;
    }

    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }
}
