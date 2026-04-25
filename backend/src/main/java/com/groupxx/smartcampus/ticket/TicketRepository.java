package com.groupxx.smartcampus.ticket;

import com.groupxx.smartcampus.ticket.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByReporterId(String reporterId);
    List<Ticket> findByAssignedTechnicianId(String assignedTechnicianId);
    List<Ticket> findByStatus(TicketStatus status);
}
