package com.growgenie.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ideas")
public class Idea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "idea_name")
    private String ideaName;

    private String category;
    private String budget;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String roadmap;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getIdeaName() { return ideaName; }
    public void setIdeaName(String ideaName) { this.ideaName = ideaName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }
    public String getRoadmap() { return roadmap; }
    public void setRoadmap(String roadmap) { this.roadmap = roadmap; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
