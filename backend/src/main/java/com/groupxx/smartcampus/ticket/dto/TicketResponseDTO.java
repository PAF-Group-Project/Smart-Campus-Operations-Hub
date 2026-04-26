package com.groupxx.smartcampus.ticket.dto;

import com.groupxx.smartcampus.ticket.enums.Category;
import com.groupxx.smartcampus.ticket.enums.Priority;
import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponseDTO {
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

    private List<AttachmentDTO> attachments;
    private List<CommentDTO> comments;
    private List<StatusHistoryDTO> history;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // SLA Fields
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private Long firstResponseDuration;
    private Long resolutionDuration;
    private Boolean firstResponseSlaBreached;
    private Boolean resolutionSlaBreached;

    @Data
    public static class AttachmentDTO {
        private String name;
        private String url;
        private String contentType;
        private long size;
    }

    @Data
    public static class CommentDTO {
        private String id;
        private String content;
        private String authorId;
        private String authorName;
        private String authorRole;
        private LocalDateTime createdAt;
    }

    @Data
    public static class StatusHistoryDTO {
        private TicketStatus status;
        private String changedBy;
        private String note;
        private LocalDateTime timestamp;
    }
}
