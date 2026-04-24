package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {
    @GetMapping
    public ResponseEntity<ApiResponse<List<Object>>> getAllTickets() {
        return ResponseEntity.ok(ApiResponse.success(List.of(), "Tickets fetched (Placeholder)"));
    }
}
