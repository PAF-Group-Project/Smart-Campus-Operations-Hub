package com.groupxx.smartcampus.resource;

import java.util.List;

public interface ResourceService {
    Resource createResource(Resource resource);
    List<Resource> getAllResources(ResourceType type, String location, Integer minCapacity);
    Resource getResourceById(String id);
    Resource updateResource(String id, Resource resourceDetails);
    Resource updateResourceStatus(String id, ResourceStatus status);
    void deleteResource(String id);
}
