package com.groupxx.smartcampus.ticket.dto;

import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import lombok.Data;

@Data
public class TechnicianUpdateDTO {
    private TicketStatus status;
    private String resolutionNotes;
}
