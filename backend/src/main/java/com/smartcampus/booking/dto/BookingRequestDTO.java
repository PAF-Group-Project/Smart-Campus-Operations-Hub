package com.smartcampus.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BookingRequestDTO {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;
    
    @NotBlank(message = "Date is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date must be in yyyy-MM-dd format")
    private String date;
    
    @NotBlank(message = "Start time is required")
    @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Start time must be in HH:mm format")
    private String startTime;
    
    @NotBlank(message = "End time is required")
    @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "End time must be in HH:mm format")
    private String endTime;
    
    @NotBlank(message = "Purpose is required")
    private String purpose;
    
    @NotNull(message = "Expected attendees count is required")
    @Min(value = 1, message = "Expected attendees must be at least 1")
    private Integer expectedAttendees;
}
//optimize DTO structures for booking requests and responses