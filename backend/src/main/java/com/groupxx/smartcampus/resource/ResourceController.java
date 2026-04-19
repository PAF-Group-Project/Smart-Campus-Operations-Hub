package com.groupxx.smartcampus.resource;

import com.groupxx.smartcampus.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

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
        if (!updates.containsKey("status")) {
            throw new IllegalArgumentException("Status field is required");
        }
        ResourceStatus status = ResourceStatus.valueOf(updates.get("status"));
        Resource updated = resourceService.updateResourceStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
