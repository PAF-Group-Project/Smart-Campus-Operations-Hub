package com.smartcampus.booking.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {
    private String id;
    private String resourceId;
    private String userId;
    private String userEmail;
    private String userName;
    private String date;
    private String startTime;
    private String endTime;
    private String purpose;
    private Integer expectedAttendees;
    private String status;
    private String rejectionReason;
    private String qrCodeToken;
    private boolean checkedIn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
