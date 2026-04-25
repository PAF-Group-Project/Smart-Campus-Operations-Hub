package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.exception.BusinessRuleException;
import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import com.groupxx.smartcampus.ticket.dto.*;
import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketResponseDTO createTicket(TicketRequestDTO request, List<MultipartFile> attachments) {
        if (attachments != null && attachments.size() > 3) {
            throw new BusinessRuleException("Maximum 3 attachments allowed per ticket");
        }

        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .category(request.getCategory())
                .priority(request.getPriority())
                .contactDetails(request.getContactDetails())
                .reporterId(request.getReporterId())
                .reporterName(request.getReporterName())
                .status(TicketStatus.OPEN)
                .attachments(new ArrayList<>())
                .history(new ArrayList<>())
                .comments(new ArrayList<>())
                .build();

        // Handle real file uploads
        if (attachments != null) {
            for (MultipartFile file : attachments) {
                try {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    java.nio.file.Path path = java.nio.file.Paths.get("uploads", fileName);
                    java.nio.file.Files.createDirectories(path.getParent());
                    java.nio.file.Files.write(path, file.getBytes());
                    
                    ticket.getAttachments().add(Ticket.Attachment.builder()
                            .name(file.getOriginalFilename())
                            .contentType(file.getContentType())
                            .size(file.getSize())
                            .url("/api/uploads/" + fileName)
                            .build());
                } catch (java.io.IOException e) {
                    System.err.println("Failed to save file: " + e.getMessage());
                }
            }
        }

        // Add initial history
        ticket.getHistory().add(Ticket.StatusHistory.builder()
                .status(TicketStatus.OPEN)
                .changedBy(request.getReporterName())
                .note("Ticket submitted")
                .timestamp(LocalDateTime.now())
                .build());

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getTicketsByStudent(String studentId) {
        return ticketRepository.findByReporterId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getTicketsByTechnician(String technicianId) {
        return ticketRepository.findByAssignedTechnicianId(technicianId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponseDTO getTicketById(String id, String role) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        return mapToResponse(ticket);
    }

    public TicketResponseDTO assignTechnician(String id, AdminActionDTO action) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        ticket.setAssignedTechnicianId(action.getTechnicianId());
        ticket.setAssignedTechnicianName(action.getTechnicianName());
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        
        ticket.getHistory().add(Ticket.StatusHistory.builder()
                .status(TicketStatus.IN_PROGRESS)
                .changedBy("Admin")
                .note("Assigned to technician: " + action.getTechnicianName())
                .timestamp(LocalDateTime.now())
                .build());
        
        processSLAOnFirstResponse(ticket);
        
        return mapToResponse(ticketRepository.save(ticket));
    }

    public TicketResponseDTO rejectTicket(String id, AdminActionDTO action) {
        if (action.getReason() == null || action.getReason().isBlank()) {
            throw new BusinessRuleException("Rejection reason is required");
        }
        
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(action.getReason());
        
        ticket.getHistory().add(Ticket.StatusHistory.builder()
                .status(TicketStatus.REJECTED)
                .changedBy("Admin")
                .note("Ticket rejected: " + action.getReason())
                .timestamp(LocalDateTime.now())
                .build());
        
        return mapToResponse(ticketRepository.save(ticket));
    }

    public TicketResponseDTO updateTechnicianStatus(String id, TechnicianUpdateDTO update) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        ticket.setStatus(update.getStatus());
        if (update.getResolutionNotes() != null) {
            ticket.setResolutionNotes(update.getResolutionNotes());
        }
        
        ticket.getHistory().add(Ticket.StatusHistory.builder()
                .status(update.getStatus())
                .changedBy("Technician")
                .note("Update by technician: " + (update.getResolutionNotes() != null ? update.getResolutionNotes() : ""))
                .timestamp(LocalDateTime.now())
                .build());

        if (update.getStatus() == TicketStatus.RESOLVED || update.getStatus() == TicketStatus.CLOSED) {
            processSLAOnResolution(ticket);
        }
        
        return mapToResponse(ticketRepository.save(ticket));
    }

    public TicketResponseDTO addComment(String id, CommentRequestDTO request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        Ticket.Comment comment = Ticket.Comment.builder()
                .id(UUID.randomUUID().toString())
                .content(request.getContent())
                .authorId(request.getAuthorId())
                .authorName(request.getAuthorName())
                .authorRole(request.getAuthorRole())
                .createdAt(LocalDateTime.now())
                .build();
        
        ticket.getComments().add(comment);

        if (!"STUDENT".equals(request.getAuthorRole())) {
            processSLAOnFirstResponse(ticket);
        }

        return mapToResponse(ticketRepository.save(ticket));
    }

    public void deleteComment(String ticketId, String commentId, String userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        Ticket.Comment commentToRemove = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        // Ownership check
        if (!commentToRemove.getAuthorId().equals(userId)) {
            throw new BusinessRuleException("You can only delete your own comments");
        }
        
        ticket.getComments().remove(commentToRemove);
        ticketRepository.save(ticket);
    }

    public TicketResponseDTO updateComment(String ticketId, String commentId, String userId, String newContent) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        Ticket.Comment commentToUpdate = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        // Ownership check
        if (!commentToUpdate.getAuthorId().equals(userId)) {
            throw new BusinessRuleException("You can only edit your own comments");
        }
        
        commentToUpdate.setContent(newContent);
        commentToUpdate.setUpdatedAt(LocalDateTime.now());
        
        return mapToResponse(ticketRepository.save(ticket));
    }

    private TicketResponseDTO mapToResponse(Ticket ticket) {
        TicketResponseDTO response = new TicketResponseDTO();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setLocation(ticket.getLocation());
        response.setCategory(ticket.getCategory());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setContactDetails(ticket.getContactDetails());
        response.setReporterId(ticket.getReporterId());
        response.setReporterName(ticket.getReporterName());
        response.setAssignedTechnicianId(ticket.getAssignedTechnicianId());
        response.setAssignedTechnicianName(ticket.getAssignedTechnicianName());
        response.setRejectionReason(ticket.getRejectionReason());
        response.setResolutionNotes(ticket.getResolutionNotes());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());

        // SLA Fields
        response.setFirstResponseAt(ticket.getFirstResponseAt());
        response.setResolvedAt(ticket.getResolvedAt());
        response.setFirstResponseDuration(ticket.getFirstResponseDuration());
        response.setResolutionDuration(ticket.getResolutionDuration());
        response.setFirstResponseSlaBreached(ticket.getFirstResponseSlaBreached());
        response.setResolutionSlaBreached(ticket.getResolutionSlaBreached());

        response.setAttachments(ticket.getAttachments().stream().map(a -> {
            TicketResponseDTO.AttachmentDTO dto = new TicketResponseDTO.AttachmentDTO();
            dto.setName(a.getName());
            dto.setUrl(a.getUrl());
            dto.setContentType(a.getContentType());
            dto.setSize(a.getSize());
            return dto;
        }).collect(Collectors.toList()));

        response.setComments(ticket.getComments().stream().map(c -> {
            TicketResponseDTO.CommentDTO dto = new TicketResponseDTO.CommentDTO();
            dto.setId(c.getId());
            dto.setContent(c.getContent());
            dto.setAuthorId(c.getAuthorId());
            dto.setAuthorName(c.getAuthorName());
            dto.setAuthorRole(c.getAuthorRole());
            dto.setCreatedAt(c.getCreatedAt());
            return dto;
        }).collect(Collectors.toList()));

        response.setHistory(ticket.getHistory().stream().map(h -> {
            TicketResponseDTO.StatusHistoryDTO dto = new TicketResponseDTO.StatusHistoryDTO();
            dto.setStatus(h.getStatus());
            dto.setChangedBy(h.getChangedBy());
            dto.setNote(h.getNote());
            dto.setTimestamp(h.getTimestamp());
            return dto;
        }).collect(Collectors.toList()));

        return response;
    }
    private void processSLAOnFirstResponse(Ticket ticket) {
        if (ticket.getFirstResponseAt() != null) return;

        System.out.println("Processing First Response SLA for ticket: " + ticket.getId());
        LocalDateTime now = LocalDateTime.now();
        ticket.setFirstResponseAt(now);
        System.out.println("First response set at: " + now);

        if (ticket.getCreatedAt() != null) {
            System.out.println("Ticket created at: " + ticket.getCreatedAt());
            long durationMinutes = Duration.between(ticket.getCreatedAt(), now).toMinutes();
            ticket.setFirstResponseDuration(durationMinutes);
            System.out.println("Duration minutes: " + durationMinutes);
            
            long threshold = switch (ticket.getPriority()) {
                case LOW -> 4 * 60;
                case MEDIUM -> 2 * 60;
                case HIGH -> 30;
                case URGENT -> 15;
                default -> 4 * 60;
            };
            
            ticket.setFirstResponseSlaBreached(durationMinutes > threshold);
            System.out.println("Breached: " + ticket.getFirstResponseSlaBreached());
        } else {
            System.out.println("Ticket createdAt is NULL!");
        }
    }

    private void processSLAOnResolution(Ticket ticket) {
        if (ticket.getResolvedAt() != null) return;

        System.out.println("Processing Resolution SLA for ticket: " + ticket.getId());
        LocalDateTime now = LocalDateTime.now();
        ticket.setResolvedAt(now);
        System.out.println("Resolved at: " + now);

        if (ticket.getCreatedAt() != null) {
            long durationMinutes = Duration.between(ticket.getCreatedAt(), now).toMinutes();
            ticket.setResolutionDuration(durationMinutes);
            System.out.println("Resolution duration minutes: " + durationMinutes);
            
            long threshold = switch (ticket.getPriority()) {
                case LOW -> 48 * 60;
                case MEDIUM -> 24 * 60;
                case HIGH -> 8 * 60;
                case URGENT -> 2 * 60;
                default -> 48 * 60;
            };
            
            ticket.setResolutionSlaBreached(durationMinutes > threshold);
            System.out.println("Resolution breached: " + ticket.getResolutionSlaBreached());
        } else {
            System.out.println("Ticket createdAt is NULL during resolution!");
        }
    }
}
