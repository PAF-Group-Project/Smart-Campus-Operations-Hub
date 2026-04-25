package com.groupxx.smartcampus.resource;

import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources(ResourceType type, ResourceStatus status, String location,
                                          String building, Integer minCapacity, Integer maxCapacity) {
        Query query = new Query();

        if (type != null) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (location != null && !location.trim().isEmpty()) {
            query.addCriteria(Criteria.where("location")
                    .regex(Pattern.compile(Pattern.quote(location.trim()), Pattern.CASE_INSENSITIVE)));
        }
        if (building != null && !building.trim().isEmpty()) {
            query.addCriteria(Criteria.where("building")
                    .regex(Pattern.compile(Pattern.quote(building.trim()), Pattern.CASE_INSENSITIVE)));
        }
        if (minCapacity != null) {
            query.addCriteria(Criteria.where("capacity").gte(minCapacity));
        }
        if (maxCapacity != null) {
            Criteria capacityCriteria = new Criteria().orOperator(
                    Criteria.where("capacity").lte(maxCapacity),
                    Criteria.where("capacity").is(null)
            );
            query.addCriteria(capacityCriteria);
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
        existing.setBuilding(resourceDetails.getBuilding());
        existing.setFloor(resourceDetails.getFloor());
        existing.setStatus(resourceDetails.getStatus());
        existing.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
        existing.setDescription(resourceDetails.getDescription());
        existing.setImageUrl(resourceDetails.getImageUrl());
        existing.setAmenities(resourceDetails.getAmenities());

        return resourceRepository.save(existing);
    }

    @Override
    public Resource updateResourceStatus(String id, ResourceStatus status) {
        Resource existing = getResourceById(id);
        existing.setStatus(status);
        return resourceRepository.save(existing);
    }

    @Override
    public Resource updateAmenities(String id, List<String> amenities) {
        Resource existing = getResourceById(id);
        existing.setAmenities(amenities);
        return resourceRepository.save(existing);
    }

    @Override
    public void deleteResource(String id) {
        Resource existing = getResourceById(id);
        resourceRepository.delete(existing);
    }

    @Override
    public List<Resource> searchResources(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return resourceRepository.findAll();
        }
        Pattern pattern = Pattern.compile(Pattern.quote(keyword.trim()), Pattern.CASE_INSENSITIVE);
        Query query = new Query();
        query.addCriteria(new Criteria().orOperator(
                Criteria.where("name").regex(pattern),
                Criteria.where("location").regex(pattern),
                Criteria.where("description").regex(pattern),
                Criteria.where("building").regex(pattern)
        ));
        return mongoTemplate.find(query, Resource.class);
    }

    @Override
    public List<Resource> getResourcesByType(ResourceType type) {
        Query query = new Query(Criteria.where("type").is(type));
        return mongoTemplate.find(query, Resource.class);
    }

    @Override
    public List<Resource> getAvailableResources() {
        Query query = new Query(Criteria.where("status").is(ResourceStatus.ACTIVE));
        return mongoTemplate.find(query, Resource.class);
    }

    @Override
    public Map<String, Object> getResourceStats() {
        List<Resource> all = resourceRepository.findAll();

        long totalResources = all.size();
        long activeCount = all.stream().filter(r -> r.getStatus() == ResourceStatus.ACTIVE).count();
        long outOfServiceCount = all.stream().filter(r -> r.getStatus() == ResourceStatus.OUT_OF_SERVICE).count();
        long underMaintenanceCount = all.stream().filter(r -> r.getStatus() == ResourceStatus.UNDER_MAINTENANCE).count();

        Map<String, Long> countByType = new HashMap<>();
        countByType.put("LAB", all.stream().filter(r -> r.getType() == ResourceType.LAB).count());
        countByType.put("LECTURE_HALL", all.stream().filter(r -> r.getType() == ResourceType.LECTURE_HALL).count());
        countByType.put("MEETING_ROOM", all.stream().filter(r -> r.getType() == ResourceType.MEETING_ROOM).count());
        countByType.put("EQUIPMENT", all.stream().filter(r -> r.getType() == ResourceType.EQUIPMENT).count());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalResources", totalResources);
        stats.put("activeCount", activeCount);
        stats.put("outOfServiceCount", outOfServiceCount);
        stats.put("underMaintenanceCount", underMaintenanceCount);
        stats.put("countByType", countByType);

        return stats;
    }
}
