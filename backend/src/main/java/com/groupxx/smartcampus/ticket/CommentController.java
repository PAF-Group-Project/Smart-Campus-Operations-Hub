package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.ticket.dto.CommentUpdateDTO;
import com.groupxx.smartcampus.ticket.dto.TicketResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final TicketService ticketService;

    @PostMapping("/update")
    public ResponseEntity<TicketResponseDTO> updateComment(@RequestBody CommentUpdateDTO update) {
        return ResponseEntity.ok(ticketService.updateComment(
                update.getTicketId(),
                update.getCommentId(),
                update.getUserId(),
                update.getContent()));
    }
}
