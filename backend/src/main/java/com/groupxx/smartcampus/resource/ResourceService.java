package com.groupxx.smartcampus.resource;

import java.util.List;
import java.util.Map;

public interface ResourceService {
    Resource createResource(Resource resource);
    List<Resource> getAllResources(ResourceType type, ResourceStatus status, String location, String building, Integer minCapacity, Integer maxCapacity);
    Resource getResourceById(String id);
    Resource updateResource(String id, Resource resourceDetails);
    Resource updateResourceStatus(String id, ResourceStatus status);
    Resource updateAmenities(String id, List<String> amenities);
    void deleteResource(String id);
    List<Resource> searchResources(String keyword);
    List<Resource> getResourcesByType(ResourceType type);
    List<Resource> getAvailableResources();
    Map<String, Object> getResourceStats();
}
