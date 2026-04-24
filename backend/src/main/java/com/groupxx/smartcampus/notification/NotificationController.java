package com.groupxx.smartcampus.notification;

import com.groupxx.smartcampus.common.ApiResponse;
import com.groupxx.smartcampus.notification.dto.NotificationResponse;
import com.groupxx.smartcampus.notification.dto.TestNotificationRequest;
import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private ResponseEntity<ApiResponse<?>> unauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Not authenticated"));
    }

    private String getCurrentUserId(Authentication authentication) {
        String email = extractEmail(authentication);
        if (email == null || email.isBlank()) {
            return null;
        }
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElse(null);
    }

    private String extractEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2User oAuth2User) {
            return oAuth2User.getAttribute("email");
        }
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        if (principal instanceof String value && !"anonymousUser".equalsIgnoreCase(value)) {
            return value;
        }

        return null;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<?>> getMyNotifications(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        List<NotificationResponse> notifications = notificationService.getMyNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success(notifications, "Notifications retrieved successfully"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<?>> getUnreadCount(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Unread count retrieved successfully"));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<?>> markAsRead(@PathVariable String id, Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        NotificationResponse notification = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success(notification, "Notification marked as read"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<?>> markAllAsRead(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteNotification(@PathVariable String id, Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Notification deleted successfully"));
    }

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<?>> createTestNotification(
            Authentication authentication,
            @RequestBody(required = false) TestNotificationRequest request
    ) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }
        if (request == null) {
            request = new TestNotificationRequest();
        }

        NotificationResponse notification = notificationService.createTestNotification(userId, request);
        return ResponseEntity.ok(ApiResponse.success(notification, "Test notification created successfully"));
    }
}
