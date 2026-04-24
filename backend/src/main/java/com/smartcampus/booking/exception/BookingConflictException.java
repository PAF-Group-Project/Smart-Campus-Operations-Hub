package com.smartcampus.booking.exception;

import com.smartcampus.booking.dto.ConflictResponseDTO;
import lombok.Getter;

@Getter
public class BookingConflictException extends RuntimeException {
    
    private final transient ConflictResponseDTO conflictResponse;

    public BookingConflictException(ConflictResponseDTO conflictResponse) {
        super(conflictResponse.getMessage());
        this.conflictResponse = conflictResponse;
    }
}
