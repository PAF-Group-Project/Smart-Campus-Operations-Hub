package com.groupxx.smartcampus.ticket.dto;

import com.groupxx.smartcampus.ticket.enums.Category;
import com.groupxx.smartcampus.ticket.enums.Priority;
import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Category is required")
    private Category category;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private String contactDetails;
    
    // For now, since no auth, we take reporter details from request
    private String reporterId;
    private String reporterName;
}
