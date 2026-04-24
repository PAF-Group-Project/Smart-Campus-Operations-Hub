package com.groupxx.smartcampus.resource;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String name;
    private String type; // e.g., ROOM, EQUIPMENT
    private String description;
    private boolean available;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
