package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.ticket.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.groupxx.smartcampus.common.ApiResponse;
import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> createTicketJson(
            @RequestBody @Valid TicketRequestDTO ticketRequest,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        ticketRequest.setReporterId(user.getId());
        ticketRequest.setReporterName(user.getName());
        TicketResponseDTO created = ticketService.createTicket(ticketRequest, null);
        return new ResponseEntity<>(ApiResponse.success(created, "Ticket created successfully"), HttpStatus.CREATED);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> createTicketMultipart(
            @RequestPart("ticket") @Valid TicketRequestDTO ticketRequest,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        ticketRequest.setReporterId(user.getId());
        ticketRequest.setReporterName(user.getName());
         TicketResponseDTO created = ticketService.createTicket(ticketRequest, attachments);
        return new ResponseEntity<>(ApiResponse.success(created, "Ticket created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getAllTickets() {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getAllTickets(), "All tickets fetched"));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getMyTickets(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketsByStudent(user.getId()), "Your tickets fetched"));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getAssignedTickets(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketsByTechnician(user.getId()), "Assigned tickets fetched"));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getStudentTickets(@PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketsByStudent(studentId), "Student tickets fetched"));
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TicketResponseDTO>>> getTechnicianTickets(@PathVariable String technicianId) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketsByTechnician(technicianId), "Technician tickets fetched"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> getTicketById(
            @PathVariable String id, 
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketByIdAndUser(id, user), "Ticket fetched successfully"));
    }

    @PatchMapping(value = "/{id}/assign", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> assignTechnician(
            @PathVariable String id, @RequestBody AdminActionDTO action) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.assignTechnician(id, action), "Technician assigned"));
    }

    @PatchMapping(value = "/{id}/reject", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> rejectTicket(
            @PathVariable String id, @RequestBody AdminActionDTO action) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.rejectTicket(id, action), "Ticket rejected"));
    }

    @PatchMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> updateStatus(
            @PathVariable String id, @RequestBody TechnicianUpdateDTO update, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(ticketService.updateTechnicianStatus(id, update, user.getId()), "Status updated"));
    }

    @PostMapping(value = "/{id}/comments", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> addComment(
            @PathVariable String id, @RequestBody @Valid CommentRequestDTO commentRequest, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        commentRequest.setAuthorId(user.getId());
        commentRequest.setAuthorName(user.getName());
        commentRequest.setAuthorRole(user.getRole().name());
        return ResponseEntity.ok(ApiResponse.success(ticketService.addComment(id, commentRequest), "Comment added"));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable String ticketId, 
            @PathVariable String commentId, 
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        ticketService.deleteComment(ticketId, commentId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Comment deleted"));
    }

    @PatchMapping(value = "/{ticketId}/comments/{commentId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TicketResponseDTO>> updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestBody CommentRequestDTO updateRequest,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(ticketService.updateComment(ticketId, commentId, user.getId(), updateRequest.getContent()), "Comment updated"));
    }

}
