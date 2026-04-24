package com.smartcampus.booking.domain;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "booking")
public class Booking {
    
    @Id
    private String id;
    
    private String resourceId;
    private String userId;
    private String userEmail;
    private String userName;
    
    private String date; // Format: yyyy-MM-dd
    private String startTime; // Format: HH:mm
    private String endTime; // Format: HH:mm
    private String purpose;
    private Integer expectedAttendees;
    
    private String status; // PENDING, APPROVED, REJECTED, CANCELLED, NO_SHOW
    
    private String rejectionReason;
    private String qrCodeToken;
    private boolean checkedIn = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
