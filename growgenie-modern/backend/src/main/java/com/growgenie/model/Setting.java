package com.growgenie.model;

import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class Setting {
    @Id
    @Column(name = "setting_key")
    private String settingKey;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String settingValue;

    public String getSettingKey() { return settingKey; }
    public void setSettingKey(String settingKey) { this.settingKey = settingKey; }
    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
}
