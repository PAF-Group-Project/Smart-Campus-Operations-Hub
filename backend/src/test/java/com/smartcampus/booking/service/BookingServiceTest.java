package com.smartcampus.booking.service;

import com.smartcampus.booking.domain.Booking;
import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.dto.StatusUpdateDTO;
import com.smartcampus.booking.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Collections;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    private BookingRequestDTO requestDTO;
    private Booking booking;

    @BeforeEach
    void setUp() {
        requestDTO = new BookingRequestDTO();
        requestDTO.setResourceId("RES-001");
        requestDTO.setDate("2026-03-30");
        requestDTO.setStartTime("10:00");
        requestDTO.setEndTime("12:00");
        requestDTO.setPurpose("Test Purpose");
        requestDTO.setExpectedAttendees(10);

        booking = new Booking();
        booking.setId("123");
        booking.setResourceId("RES-001");
        booking.setDate("2026-03-30");
        booking.setStartTime("10:00");
        booking.setEndTime("12:00");
        booking.setStatus("PENDING");
        booking.setUserId("USR-101");
    }

    @Test
    void testCreateBooking_Success() {
        when(bookingRepository.findConflictingBookings(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        BookingResponseDTO created = bookingService.createBooking(requestDTO, "USR-101", "test@sliit.lk", "Test User");

        assertNotNull(created);
        assertEquals("PENDING", created.getStatus());
    }

    @Test
    void testUpdateStatus_Approved() {
        when(bookingRepository.findById("123")).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        StatusUpdateDTO statusUpdateDTO = new StatusUpdateDTO();
        statusUpdateDTO.setStatus("APPROVED");

        BookingResponseDTO updated = bookingService.updateBookingStatus("123", statusUpdateDTO);

        assertNotNull(updated);
        assertEquals("APPROVED", updated.getStatus());
    }

    @Test
    void testCancelBooking_Success() {
        when(bookingRepository.findById("123")).thenReturn(Optional.of(booking));
        bookingService.cancelBooking("123", "USR-101");
        verify(bookingRepository, times(1)).delete(booking);
    }
}