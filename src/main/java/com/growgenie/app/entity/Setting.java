package com.growgenie.app.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class Setting {
    @Id
    private String settingKey;
    @Lob
    private String settingValue;

    public String getSettingKey() {
        return settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey;
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }
}
