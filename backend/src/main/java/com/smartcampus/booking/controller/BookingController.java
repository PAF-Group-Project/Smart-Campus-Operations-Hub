package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.dto.ConflictResponseDTO;
import com.smartcampus.booking.dto.StatusUpdateDTO;
import com.smartcampus.booking.exception.UnauthorizedActionException;
import com.smartcampus.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@org.springframework.web.bind.annotation.CrossOrigin("*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            @RequestHeader("x-user-id") String userId,
            @RequestHeader("x-user-email") String userEmail,
            @RequestHeader("x-user-name") String userName) {
        
        BookingResponseDTO created = bookingService.createBooking(request, userId, userEmail, userName);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestHeader("x-user-id") String userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestHeader("x-user-role") String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
            
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only ADMINs can view all bookings");
        }
        
        return ResponseEntity.ok(bookingService.getAllBookings(status, resourceId, startDate, endDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateDTO statusUpdate,
            @RequestHeader("x-user-role") String role) {
            
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only ADMINs can update booking statuses");
        }
        
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, statusUpdate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable String id,
            @RequestHeader("x-user-id") String userId) {
            
        log.info("Cancelling booking {} for user {}", id, userId);
        bookingService.cancelBooking(id, userId);
        log.info("Booking {} cancelled successfully", id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkin")
    public ResponseEntity<Void> checkIn(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token is required");
        }
        bookingService.checkIn(token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @RequestHeader("x-user-role") String role) {
            
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only ADMINs can view system analytics");
        }
        
        return ResponseEntity.ok(bookingService.getAnalytics());
    }

    @GetMapping("/check-availability")
    public ResponseEntity<List<ConflictResponseDTO.TimeSlot>> checkAvailability(
            @RequestParam String resourceId,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime) {
            
        return ResponseEntity.ok(bookingService.checkAvailability(resourceId, date, startTime, endTime));
    }
}

//implement REST endpoints for booking management
