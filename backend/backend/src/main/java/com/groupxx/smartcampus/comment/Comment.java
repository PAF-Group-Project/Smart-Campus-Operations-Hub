package com.groupxx.smartcampus.comment;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String ticketId;
    private String userId;
    private String content;

    @CreatedDate
    private LocalDateTime createdAt;
}
