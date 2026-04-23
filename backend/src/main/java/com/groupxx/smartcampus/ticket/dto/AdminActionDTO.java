package com.groupxx.smartcampus.ticket.dto;

import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import lombok.Data;

@Data
public class AdminActionDTO {
    private String technicianId;
    private String technicianName;
    private String reason; // for rejection
}
