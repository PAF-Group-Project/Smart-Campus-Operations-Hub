package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.ticket.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<TicketResponseDTO> createTicket(
            @RequestPart("ticket") @Valid TicketRequestDTO ticketRequest,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        ticketRequest.setReporterId(user.getId());
        ticketRequest.setReporterName(user.getName());
        return new ResponseEntity<>(ticketService.createTicket(ticketRequest, attachments), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<TicketResponseDTO>> getMyTickets(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ticketService.getTicketsByStudent(user.getId()));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasAuthority('TECHNICIAN')")
    public ResponseEntity<List<TicketResponseDTO>> getAssignedTickets(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(user.getId()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TicketResponseDTO>> getStudentTickets(@PathVariable String studentId) {
        return ResponseEntity.ok(ticketService.getTicketsByStudent(studentId));
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TicketResponseDTO>> getTechnicianTickets(@PathVariable String technicianId) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(technicianId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponseDTO> getTicketById(
            @PathVariable String id, 
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ticketService.getTicketByIdAndUser(id, user));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TicketResponseDTO> assignTechnician(
            @PathVariable String id, @RequestBody AdminActionDTO action) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, action));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TicketResponseDTO> rejectTicket(
            @PathVariable String id, @RequestBody AdminActionDTO action) {
        return ResponseEntity.ok(ticketService.rejectTicket(id, action));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable String id, @RequestBody TechnicianUpdateDTO update, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ticketService.updateTechnicianStatus(id, update, user.getId()));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponseDTO> addComment(
            @PathVariable String id, @RequestBody @Valid CommentRequestDTO commentRequest, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        commentRequest.setAuthorId(user.getId());
        commentRequest.setAuthorName(user.getName());
        commentRequest.setAuthorRole(user.getRole().name());
        return ResponseEntity.ok(ticketService.addComment(id, commentRequest));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String ticketId, 
            @PathVariable String commentId, 
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        ticketService.deleteComment(ticketId, commentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponseDTO> updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestBody CommentRequestDTO updateRequest,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ticketService.updateComment(ticketId, commentId, user.getId(), updateRequest.getContent()));
    }

}
