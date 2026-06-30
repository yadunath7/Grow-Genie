package com.growgenie.app.service;

import com.growgenie.app.entity.LoginHistory;
import com.growgenie.app.repository.LoginHistoryRepository;
import com.growgenie.app.util.DeviceDTO;
import com.growgenie.app.util.GeoIpUtils;
import com.growgenie.app.util.LocationDTO;
import com.growgenie.app.util.UserAgentUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoginHistoryService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final GeoIpUtils geoIpUtils;
    private final UserAgentUtils userAgentUtils;

    @Autowired
    public LoginHistoryService(LoginHistoryRepository loginHistoryRepository,
                               GeoIpUtils geoIpUtils,
                               UserAgentUtils userAgentUtils) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.geoIpUtils = geoIpUtils;
        this.userAgentUtils = userAgentUtils;
    }

    public void recordLogin(Long userId, HttpServletRequest request) {
        try {
            LoginHistory history = new LoginHistory();
            history.setUserId(userId);
            history.setLoginTime(LocalDateTime.now());

            // 1. IP Address
            String ipAddress = extractIpAddress(request);
            history.setIpAddress(ipAddress);

            // 2. User Agent
            String userAgentString = request.getHeader("User-Agent");
            history.setUserAgent(userAgentString);

            // 3. Device detection
            DeviceDTO deviceDTO = userAgentUtils.parseUserAgent(userAgentString);
            history.setBrowser(deviceDTO.getBrowser());
            history.setOperatingSystem(deviceDTO.getOperatingSystem());
            history.setDeviceType(deviceDTO.getDeviceType());

            // 4. Location detection
            LocationDTO locationDTO = geoIpUtils.getLocation(ipAddress);
            history.setCountry(locationDTO.getCountry());
            history.setState(locationDTO.getState());
            history.setCity(locationDTO.getCity());
            history.setLatitude(locationDTO.getLatitude());
            history.setLongitude(locationDTO.getLongitude());

            loginHistoryRepository.save(history);
        } catch (Exception e) {
            // Silently fail if tracking fails, do not block login
            System.err.println("Failed to record login history: " + e.getMessage());
        }
    }

    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Can be a comma-separated list of IPs. First one is the real client.
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    public List<LoginHistory> getUserLoginHistory(Long userId) {
        return loginHistoryRepository.findByUserIdOrderByLoginTimeDesc(userId);
    }
}
