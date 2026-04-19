package com.groupxx.smartcampus.resource;

import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources(ResourceType type, String location, Integer minCapacity) {
        Query query = new Query();

        if (type != null) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (location != null && !location.trim().isEmpty()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }
        if (minCapacity != null) {
            query.addCriteria(Criteria.where("capacity").gte(minCapacity));
        }

        return mongoTemplate.find(query, Resource.class);
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(String id, Resource resourceDetails) {
        Resource existing = getResourceById(id);
        
        existing.setName(resourceDetails.getName());
        existing.setType(resourceDetails.getType());
        existing.setCapacity(resourceDetails.getCapacity());
        existing.setLocation(resourceDetails.getLocation());
        existing.setStatus(resourceDetails.getStatus());
        existing.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
        existing.setDescription(resourceDetails.getDescription());
        existing.setImageUrl(resourceDetails.getImageUrl());
        
        return resourceRepository.save(existing);
    }

    @Override
    public Resource updateResourceStatus(String id, ResourceStatus status) {
        Resource existing = getResourceById(id);
        existing.setStatus(status);
        return resourceRepository.save(existing);
    }

    @Override
    public void deleteResource(String id) {
        Resource existing = getResourceById(id);
        resourceRepository.delete(existing);
    }
}
