package com.groupxx.smartcampus.preferences;

import com.groupxx.smartcampus.common.ApiResponse;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/preferences/notifications")
@RequiredArgsConstructor
public class NotificationPreferencesController {

    private final NotificationPreferencesService preferencesService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getNotificationPreferences(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        NotificationPreferences preferences = preferencesService.getPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success(preferences, "Notification preferences retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<?>> updateNotificationPreferences(
            Authentication authentication,
            @RequestBody NotificationPreferences preferences
    ) {
        String userId = getCurrentUserId(authentication);
        if (userId == null) {
            return unauthorizedResponse();
        }

        NotificationPreferences updated = preferencesService.updatePreferences(userId, preferences);
        return ResponseEntity.ok(ApiResponse.success(updated, "Notification preferences updated successfully"));
    }

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
}
