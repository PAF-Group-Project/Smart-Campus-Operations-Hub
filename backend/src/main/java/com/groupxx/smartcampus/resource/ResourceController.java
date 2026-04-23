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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Resource>> createResource(@Valid @RequestBody Resource resource) {
        Resource created = resourceService.createResource(resource);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Resource created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Resource>>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity) {
        List<Resource> resources = resourceService.getAllResources(type, location, minCapacity);
        return ResponseEntity.ok(ApiResponse.success(resources, "Resources fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Resource>> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.success(resource, "Resource fetched successfully"));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
