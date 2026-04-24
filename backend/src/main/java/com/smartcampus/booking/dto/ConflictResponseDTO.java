package com.smartcampus.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ConflictResponseDTO {
    private String message;
    private List<TimeSlot> suggestedSlots;
    
    @Data
    @AllArgsConstructor
    public static class TimeSlot {
        private String startTime;
        private String endTime;
    }
}
