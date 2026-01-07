package com.cafe24.crm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "healthy",
                "service", "cafe24-crm-api",
                "version", "0.1.0",
                "timestamp", LocalDateTime.now().toString()
        );
    }
}
