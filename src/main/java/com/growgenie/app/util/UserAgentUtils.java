package com.growgenie.app.util;

import org.springframework.stereotype.Component;
import ua_parser.Client;
import ua_parser.Parser;

@Component
public class UserAgentUtils {

    private final Parser parser;

    public UserAgentUtils() {
        this.parser = new Parser();
    }

    public DeviceDTO parseUserAgent(String userAgentString) {
        DeviceDTO deviceDTO = new DeviceDTO();
        if (userAgentString == null || userAgentString.isEmpty()) {
            return deviceDTO;
        }

        try {
            Client client = parser.parse(userAgentString);
            
            // Browser
            if (client.userAgent != null && client.userAgent.family != null) {
                deviceDTO.setBrowser(client.userAgent.family + (client.userAgent.major != null ? " " + client.userAgent.major : ""));
            }
            
            // Operating System
            if (client.os != null && client.os.family != null) {
                deviceDTO.setOperatingSystem(client.os.family + (client.os.major != null ? " " + client.os.major : ""));
            }
            
            // Device Type
            if (client.device != null && client.device.family != null && !client.device.family.equals("Other")) {
                deviceDTO.setDeviceType(client.device.family);
            } else {
                // Fallback basic device detection based on OS
                if (deviceDTO.getOperatingSystem() != null) {
                    String os = deviceDTO.getOperatingSystem().toLowerCase();
                    if (os.contains("ios") || os.contains("android")) {
                        deviceDTO.setDeviceType("Mobile/Tablet");
                    } else if (os.contains("windows") || os.contains("mac") || os.contains("linux")) {
                        deviceDTO.setDeviceType("Desktop");
                    }
                }
            }
        } catch (Exception e) {
            // parsing error
        }

        return deviceDTO;
    }
}
