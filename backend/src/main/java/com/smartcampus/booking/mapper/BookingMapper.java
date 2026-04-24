package com.smartcampus.booking.mapper;

import com.smartcampus.booking.domain.Booking;
import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public Booking toEntity(BookingRequestDTO dto, String userId, String userEmail, String userName) {
        Booking booking = new Booking();
        booking.setResourceId(dto.getResourceId());
        booking.setUserId(userId);
        booking.setUserEmail(userEmail);
        booking.setUserName(userName);
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setExpectedAttendees(dto.getExpectedAttendees());
        return booking;
    }

    public BookingResponseDTO toDto(Booking entity) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(entity.getId());
        dto.setResourceId(entity.getResourceId());
        dto.setUserId(entity.getUserId());
        dto.setUserEmail(entity.getUserEmail());
        dto.setUserName(entity.getUserName());
        dto.setDate(entity.getDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setPurpose(entity.getPurpose());
        dto.setExpectedAttendees(entity.getExpectedAttendees());
        dto.setStatus(entity.getStatus());
        dto.setRejectionReason(entity.getRejectionReason());
        dto.setQrCodeToken(entity.getQrCodeToken());
        dto.setCheckedIn(entity.isCheckedIn());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
