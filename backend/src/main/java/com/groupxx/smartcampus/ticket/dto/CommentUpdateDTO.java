package com.groupxx.smartcampus.ticket.dto;

import lombok.Data;

@Data
public class CommentUpdateDTO {
    private String ticketId;
    private String commentId;
    private String userId;
    private String content;
}
