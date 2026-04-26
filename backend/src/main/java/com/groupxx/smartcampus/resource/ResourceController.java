package com.groupxx.smartcampus.resource;

import com.groupxx.smartcampus.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // PUBLIC ENDPOINTS

    @GetMapping
    public ResponseEntity<ApiResponse<List<Resource>>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity) {
        List<Resource> resources = resourceService.getAllResources(type, status, location, building, minCapacity, maxCapacity);
        return ResponseEntity.ok(ApiResponse.success(resources, "Resources fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Resource>> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.success(resource, "Resource fetched successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Resource>>> searchResources(@RequestParam(name = "q", required = false, defaultValue = "") String keyword) {
        List<Resource> resources = resourceService.searchResources(keyword);
        return ResponseEntity.ok(ApiResponse.success(resources, "Search results fetched successfully"));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Resource>>> getResourcesByType(@PathVariable ResourceType type) {
        List<Resource> resources = resourceService.getResourcesByType(type);
        return ResponseEntity.ok(ApiResponse.success(resources, "Resources by type fetched successfully"));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Resource>>> getAvailableResources() {
        List<Resource> resources = resourceService.getAvailableResources();
        return ResponseEntity.ok(ApiResponse.success(resources, "Available resources fetched successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResourceStats() {
        Map<String, Object> stats = resourceService.getResourceStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Stats fetched successfully"));
    }

    // ADMIN ENDPOINTS

    @PostMapping
    public ResponseEntity<ApiResponse<Resource>> createResource(@Valid @RequestBody Resource resource) {
        Resource created = resourceService.createResource(resource);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Resource created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Resource>> updateResource(@PathVariable String id, @Valid @RequestBody Resource resource) {
        Resource updated = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Resource>> updateResourceStatus(@PathVariable String id, @RequestBody Map<String, String> updates) {
        if (updates == null || !updates.containsKey("status") || updates.get("status") == null || updates.get("status").isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Status field is required"));
        }

        String statusValue = updates.get("status");
        ResourceStatus status;
        try {
            status = ResourceStatus.valueOf(statusValue);
        } catch (IllegalArgumentException ex) {
            String allowedStatuses = String.join(", ",
                    java.util.Arrays.stream(ResourceStatus.values())
                            .map(Enum::name)
                            .toArray(String[]::new));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid status value: " + statusValue + ". Allowed values are: " + allowedStatuses));
        }

        Resource updated = resourceService.updateResourceStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource status updated successfully"));
    }

    @PatchMapping("/{id}/amenities")
    public ResponseEntity<ApiResponse<Resource>> updateAmenities(@PathVariable String id, @RequestBody Map<String, List<String>> updates) {
        List<String> amenities = updates.get("amenities");
        if (amenities == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Amenities field is required"));
        }
        Resource updated = resourceService.updateAmenities(id, amenities);
        return ResponseEntity.ok(ApiResponse.success(updated, "Amenities updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
