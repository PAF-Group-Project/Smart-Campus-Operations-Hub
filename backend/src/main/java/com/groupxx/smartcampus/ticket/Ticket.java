package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.ticket.enums.Category;
import com.groupxx.smartcampus.ticket.enums.Priority;
import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String title;
    private String description;
    private String location;
    private Category category;
    private Priority priority;
    private TicketStatus status;
    private String contactDetails;
    
    private String reporterId;
    private String reporterName;
    private String assignedTechnicianId;
    private String assignedTechnicianName;
    
    private String rejectionReason;
    private String resolutionNotes;

    @Builder.Default
    private List<Attachment> attachments = new ArrayList<>();
    
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
    
    @Builder.Default
    private List<StatusHistory> history = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // SLA Fields
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private Long firstResponseDuration; // in minutes
    private Long resolutionDuration; // in minutes
    private Boolean firstResponseSlaBreached;
    private Boolean resolutionSlaBreached;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Attachment {
        private String name;
        private String url;
        private String contentType;
        private long size;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String id;
        private String content;
        private String authorId;
        private String authorName;
        private String authorRole; // STUDENT, ADMIN, TECHNICIAN
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusHistory {
        private TicketStatus status;
        private String changedBy;
        private String note;
        private LocalDateTime timestamp;
    }
}
