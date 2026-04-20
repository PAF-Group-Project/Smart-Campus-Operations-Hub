package com.groupxx.smartcampus.notification;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String title;
    private String message;
    private String type; // e.g., BOOKING_CONFIRMED, TICKET_UPDATE
    private boolean isRead;

    @CreatedDate
    private LocalDateTime createdAt;
}
