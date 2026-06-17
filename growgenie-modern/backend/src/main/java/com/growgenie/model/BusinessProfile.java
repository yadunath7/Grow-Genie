package com.growgenie.model;

import jakarta.persistence.*;

@Entity
@Table(name = "business_profile")
public class BusinessProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "logo_path")
    private String logoPath;

    @Column(name = "stamp_path")
    private String stampPath;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact_details")
    private String contactDetails;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLogoPath() { return logoPath; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }
    public String getStampPath() { return stampPath; }
    public void setStampPath(String stampPath) { this.stampPath = stampPath; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
}
