package com.groupxx.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequestDTO {
    @NotBlank(message = "Comment content cannot be empty")
    private String content;
    
    // Temporary for role simulation
    private String authorId;
    private String authorName;
    private String authorRole;
}
