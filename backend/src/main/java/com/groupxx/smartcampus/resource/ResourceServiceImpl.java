package com.groupxx.smartcampus.resource;

import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final MongoTemplate mongoTemplate;

    public ResourceServiceImpl(ResourceRepository resourceRepository, MongoTemplate mongoTemplate) {
        this.resourceRepository = resourceRepository;
        this.mongoTemplate = mongoTemplate;
    }

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
            query.addCriteria(Criteria.where("location")
                    .regex(Pattern.compile(Pattern.quote(location), Pattern.CASE_INSENSITIVE)));
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
