package com.groupxx.smartcampus.resource;

import com.groupxx.smartcampus.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

    @GetMapping
    public ResponseEntity<ApiResponse<List<Object>>> getAllResources() {
        return ResponseEntity.ok(ApiResponse.success(List.of(), "Resources fetched successfully (Placeholder)"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> createResource(@RequestBody Object resource) {
        return ResponseEntity.ok(ApiResponse.success(resource, "Resource created successfully (Placeholder)"));
    }
}
