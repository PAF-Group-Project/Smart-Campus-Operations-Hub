package com.groupxx.smartcampus.notification;

import com.groupxx.smartcampus.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    @GetMapping
    public ResponseEntity<ApiResponse<List<Object>>> getAllNotifications() {
        return ResponseEntity.ok(ApiResponse.success(List.of(), "Notifications fetched (Placeholder)"));
    }
}
