package com.smartcampus.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@org.springframework.web.bind.annotation.CrossOrigin("*")
public class ResourceController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getResources() {
        return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "RES-001", "name", "Main Auditorium", "type", "Hall"),
                Map.of("id", "RES-002", "name", "Conference Room A", "type", "Meeting"),
                Map.of("id", "RES-003", "name", "Lab 402 - Network Lab", "type", "Laboratory"),
                Map.of("id", "RES-004", "name", "Library Study Box 1", "type", "Study Space"),
                Map.of("id", "RES-005", "name", "Basketball Court", "type", "Sports Facility")
        ));
    }
}
