package com.growgenie.app.service;

import com.growgenie.app.entity.Setting;
import com.growgenie.app.repository.SettingRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SettingsService {

    @Autowired
    private SettingRepository settingRepository;

    private final Map<String, String> settingsCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        refreshCache();
    }

    public void refreshCache() {
        List<Setting> settings = settingRepository.findAll();
        settingsCache.clear();
        for (Setting setting : settings) {
            settingsCache.put(setting.getSettingKey(), setting.getSettingValue());
        }
    }

    public String getSetting(String key, String defaultValue) {
        return settingsCache.getOrDefault(key, defaultValue);
    }

    public Map<String, String> getAllSettings() {
        return new HashMap<>(settingsCache);
    }

    public void updateSetting(String key, String value) {
        if (value == null) {
            value = "";
        }
        Setting setting = settingRepository.findById(key).orElse(new Setting());
        setting.setSettingKey(key);
        setting.setSettingValue(value);
        settingRepository.save(setting);
        settingsCache.put(key, value);
    }
}
