package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.ticket.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<TicketResponseDTO> createTicket(
            @RequestPart("ticket") @Valid TicketRequestDTO ticketRequest,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments) {
        System.out.println("Received ticket creation request: " + ticketRequest.getTitle());
        return new ResponseEntity<>(ticketService.createTicket(ticketRequest, attachments), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TicketResponseDTO>> getStudentTickets(@PathVariable String studentId) {
        return ResponseEntity.ok(ticketService.getTicketsByStudent(studentId));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<TicketResponseDTO>> getTechnicianTickets(@PathVariable String technicianId) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(technicianId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDTO> assignTechnician(
            @PathVariable String id, @RequestBody AdminActionDTO action) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, action));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<TicketResponseDTO> rejectTicket(
            @PathVariable String id, @RequestBody AdminActionDTO action) {
        return ResponseEntity.ok(ticketService.rejectTicket(id, action));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable String id, @RequestBody TechnicianUpdateDTO update) {
        return ResponseEntity.ok(ticketService.updateTechnicianStatus(id, update));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponseDTO> addComment(
            @PathVariable String id, @RequestBody @Valid CommentRequestDTO commentRequest) {
        return ResponseEntity.ok(ticketService.addComment(id, commentRequest));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String ticketId, 
            @PathVariable String commentId, 
            @RequestParam String userId) {
        ticketService.deleteComment(ticketId, commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
