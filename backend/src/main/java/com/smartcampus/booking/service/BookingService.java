package com.smartcampus.booking.service;

import com.smartcampus.booking.domain.Booking;
import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.dto.ConflictResponseDTO;
import com.smartcampus.booking.dto.StatusUpdateDTO;
import com.smartcampus.booking.exception.BookingConflictException;
import com.smartcampus.booking.exception.BookingNotFoundException;
import com.smartcampus.booking.exception.UnauthorizedActionException;
import com.smartcampus.booking.mapper.BookingMapper;
import com.smartcampus.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    private static final LocalTime WORK_DAY_START = LocalTime.of(8, 0);
    private static final LocalTime WORK_DAY_END = LocalTime.of(18, 0);

    /**
     * Create a new booking
     */
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userId, String userEmail, String userName) {
        log.info("Creating new booking for user {} at resource {}", userId, request.getResourceId());
        
        // 1. Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceId(), request.getDate(), request.getStartTime(), request.getEndTime());
        
        if (!conflicts.isEmpty()) {
            List<ConflictResponseDTO.TimeSlot> suggested = suggestAvailableSlots(
                    request.getResourceId(), request.getDate(), request.getStartTime(), request.getEndTime());
            throw new BookingConflictException(new ConflictResponseDTO("Booking conflict detected for the requested time.", suggested));
        }

        // 2. Save if no conflict
        Booking entity = bookingMapper.toEntity(request, userId, userEmail, userName);
        entity.setStatus("PENDING");
        Booking saved = bookingRepository.save(entity);
        log.info("Successfully created booking {}", saved.getId());
        return bookingMapper.toDto(saved);
    }

    /**
     * Get all bookings for the specified user
     */
    public List<BookingResponseDTO> getMyBookings(String userId) {
        log.info("Fetching bookings for user {}", userId);
        return bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Admin view for all bookings
     */
    public List<BookingResponseDTO> getAllBookings(String status, String resourceId, String startDate, String endDate) {
        log.info("Fetching all bookings with filters - status: {}, resourceId: {}, startDate: {}, endDate: {}", 
                status, resourceId, startDate, endDate);
        List<Booking> bookings = bookingRepository.findAdminBookings(status, resourceId, startDate, endDate);
        log.info("Found {} bookings from database", bookings.size());
        return bookings.stream()
                .map(bookingMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Fetch a specific booking by ID
     */
    public BookingResponseDTO getBookingById(String id) {
        return bookingMapper.toDto(findBookingOrThrow(id));
    }

    /**
     * Admin update booking status
     */
    public BookingResponseDTO updateBookingStatus(String id, StatusUpdateDTO update) {
        log.info("Updating status of booking {} to {}", id, update.getStatus());
        Booking booking = findBookingOrThrow(id);
        
        booking.setStatus(update.getStatus());
        if ("APPROVED".equals(update.getStatus())) {
            booking.setQrCodeToken(UUID.randomUUID().toString());
            booking.setRejectionReason(null);
        } else if ("REJECTED".equals(update.getStatus())) {
            if (update.getRejectionReason() == null || update.getRejectionReason().trim().isEmpty()) {
                throw new IllegalArgumentException("Rejection reason must be provided when rejecting a booking.");
            }
            booking.setRejectionReason(update.getRejectionReason());
        }
        
        return bookingMapper.toDto(bookingRepository.save(booking));
    }

    /**
     * Cancel a booking (USER role)
     */
    public void cancelBooking(String id, String userId) {
        log.info("User {} cancelling booking {}", userId, id);
        Booking booking = findBookingOrThrow(id);
        
        if (!booking.getUserId().equals(userId)) {
            throw new UnauthorizedActionException("You can only cancel your own bookings.");
        }
        
        if (!"PENDING".equals(booking.getStatus()) && !"APPROVED".equals(booking.getStatus())) {
            throw new IllegalArgumentException("You can only cancel PENDING or APPROVED bookings.");
        }
        
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    /**
     * User or Staff checks in via QR Code token
     */
    public void checkIn(String qrCodeToken) {
        log.info("Attempting check-in via QR token");
        Booking booking = bookingRepository.findByQrCodeToken(qrCodeToken)
                .orElseThrow(() -> new BookingNotFoundException("Invalid or missing QR Code Token"));
                
        if (!"APPROVED".equals(booking.getStatus())) {
            throw new IllegalArgumentException("Booking is not approved.");
        }
        
        if (booking.isCheckedIn()) {
            throw new IllegalArgumentException("Booking has already been checked in.");
        }
        
        booking.setCheckedIn(true);
        bookingRepository.save(booking);
        log.info("Successfully checked in booking {}", booking.getId());
    }

    /**
     * Calculate and return analytics data
     */
    public Map<String, Object> getAnalytics() {
        log.info("Calculating analytics");
        List<Booking> allBookings = bookingRepository.findAll();
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalBookings", allBookings.size());
        
        // Count by status
        Map<String, Long> byStatus = allBookings.stream()
                .collect(Collectors.groupingBy(Booking::getStatus, Collectors.counting()));
        analytics.put("statusCounts", byStatus);
        
        // Top 5 resources
        Map<String, Long> topResources = allBookings.stream()
                .collect(Collectors.groupingBy(Booking::getResourceId, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue(), (e1, e2) -> e1, LinkedHashMap::new));
        analytics.put("topResources", topResources);
        
        // Average by day of week
        Map<String, Long> byDayOfWeek = allBookings.stream()
                .filter(b -> b.getDate() != null)
                .collect(Collectors.groupingBy(b -> {
                    try {
                        return LocalDate.parse(b.getDate()).getDayOfWeek().name();
                    } catch (Exception e) {
                        return "UNKNOWN";
                    }
                }, Collectors.counting()));
        analytics.put("dayOfWeekCounts", byDayOfWeek);
        
        return analytics;
    }

    /**
     * Check Availability endpoint for the Frontend Form checks
     */
    public List<ConflictResponseDTO.TimeSlot> checkAvailability(String resourceId, String date, String startTime, String endTime) {
        return suggestAvailableSlots(resourceId, date, startTime, endTime);
    }

    /**
     * Scheduled task to mark "NO_SHOW"
     */
    @Scheduled(fixedRate = 600000) // 10 minutes
    public void processNoShows() {
        log.info("Running scheduled NO_SHOW check");
        List<Booking> activeBookings = bookingRepository.findAdminBookings("APPROVED", null, null, null);
        
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        int updatedCount = 0;

        for (Booking booking : activeBookings) {
            try {
                LocalDate bookingDate = LocalDate.parse(booking.getDate(), dateFormatter);
                LocalTime startTime = LocalTime.parse(booking.getStartTime(), timeFormatter);
                
                if (bookingDate.isBefore(today) || (bookingDate.isEqual(today) && startTime.plusMinutes(30).isBefore(now))) {
                    if (!booking.isCheckedIn()) {
                        booking.setStatus("NO_SHOW");
                        bookingRepository.save(booking);
                        updatedCount++;
                    }
                }
            } catch (DateTimeParseException e) {
                log.error("Failed to parse date/time for booking {}", booking.getId());
            }
        }
        
        log.info("Completed NO_SHOW check. Updated {} bookings", updatedCount);
    }

    private Booking findBookingOrThrow(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking specific to ID " + id + " not found."));
    }

    private List<ConflictResponseDTO.TimeSlot> suggestAvailableSlots(String resourceId, String date, String reqStart, String reqEnd) {
        List<Booking> dayBookings = bookingRepository.findByResourceIdAndDate(resourceId, date)
                .stream()
                .filter(b -> Arrays.asList("PENDING", "APPROVED").contains(b.getStatus()))
                .collect(Collectors.toList());

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime requestedStart;
        LocalTime requestedEnd;
        try {
            requestedStart = LocalTime.parse(reqStart, timeFormatter);
            requestedEnd = LocalTime.parse(reqEnd, timeFormatter);
        } catch (Exception e) {
            return Collections.emptyList();
        }
        
        long durationMinutes = java.time.Duration.between(requestedStart, requestedEnd).toMinutes();
        if (durationMinutes <= 0) return Collections.emptyList();

        List<ConflictResponseDTO.TimeSlot> suggestions = new ArrayList<>();
        LocalTime slotStart = WORK_DAY_START;

        // Simplified algorithm: iterate by 30-minute intervals within the work day to find open slots
        while (slotStart.plusMinutes(durationMinutes).isBefore(WORK_DAY_END) || slotStart.plusMinutes(durationMinutes).equals(WORK_DAY_END)) {
            LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);
            
            boolean conflict = false;
            for (Booking b : dayBookings) {
                LocalTime bStart = LocalTime.parse(b.getStartTime(), timeFormatter);
                LocalTime bEnd = LocalTime.parse(b.getEndTime(), timeFormatter);
                
                // Overlap condition
                if (slotStart.isBefore(bEnd) && slotEnd.isAfter(bStart)) {
                    conflict = true;
                    break;
                }
            }
            
            if (!conflict) {
                suggestions.add(new ConflictResponseDTO.TimeSlot(slotStart.format(timeFormatter), slotEnd.format(timeFormatter)));
                if (suggestions.size() == 3) break;
                // Jump to the end the current valid slot to avoid overlapping suggestions
                slotStart = slotStart.plusMinutes(durationMinutes);
            } else {
                // Moving interval forward
                slotStart = slotStart.plusMinutes(30);
            }
        }
        
        return suggestions;
    }
}

//add business logic for booking availability and validation
