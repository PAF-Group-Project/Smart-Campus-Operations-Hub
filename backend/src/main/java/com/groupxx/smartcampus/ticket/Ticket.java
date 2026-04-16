package com.groupxx.smartcampus.ticket;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String title;
    private String description;
    private String category; // e.g., MAINTENANCE, IT, ELECTRICAL
    private String priority; // e.g., LOW, MEDIUM, HIGH, URGENT
    private String status; // e.g., OPEN, IN_PROGRESS, RESOLVED, CLOSED
    private String reporterId;
    private String assigneeId;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
