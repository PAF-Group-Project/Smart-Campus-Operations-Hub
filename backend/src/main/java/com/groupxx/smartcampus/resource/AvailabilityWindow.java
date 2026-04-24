package com.groupxx.smartcampus.resource;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AvailabilityWindow {
    @NotBlank(message = "Day of week is required")
    private String dayOfWeek;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;
}
