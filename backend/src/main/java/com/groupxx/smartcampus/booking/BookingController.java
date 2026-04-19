package com.groupxx.smartcampus.booking;

import com.groupxx.smartcampus.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {
    @GetMapping
    public ResponseEntity<ApiResponse<List<Object>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(List.of(), "Bookings fetched (Placeholder)"));
    }
}
