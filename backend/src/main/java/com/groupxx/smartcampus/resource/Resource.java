package com.groupxx.smartcampus.resource;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private ResourceType type;

    private Integer capacity; // nullable for equipment

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private List<AvailabilityWindow> availabilityWindows;

    private String description;
    
    private String imageUrl;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
