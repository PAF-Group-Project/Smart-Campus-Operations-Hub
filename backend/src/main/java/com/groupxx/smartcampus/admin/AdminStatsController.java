package com.groupxx.smartcampus.admin;

import com.groupxx.smartcampus.common.ApiResponse;
import com.groupxx.smartcampus.notification.NotificationRepository;
import com.groupxx.smartcampus.user.Role;
import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getStats(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Admin access required"));
        }

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .totalTechnicians(userRepository.countByRole(Role.TECHNICIAN))
                .totalNotifications(notificationRepository.count())
                .unreadNotifications(notificationRepository.countByIsReadFalse())
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats, "Admin stats retrieved successfully"));
    }

    private User getCurrentUser(Authentication authentication) {
        String email = extractEmail(authentication);
        if (email == null || email.isBlank()) {
            return null;
        }
        return userRepository.findByEmail(email).orElse(null);
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
}
