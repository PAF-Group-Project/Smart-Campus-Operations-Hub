package com.groupxx.smartcampus.preferences;

import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationPreferencesService {

    private final UserRepository userRepository;

    public NotificationPreferences getPreferences(String userId) {
        User user = findUser(userId);
        return ensurePreferences(user);
    }

    public NotificationPreferences updatePreferences(String userId, NotificationPreferences preferences) {
        User user = findUser(userId);
        user.setNotificationPreferences(preferences != null ? preferences : NotificationPreferences.defaultPreferences());
        return userRepository.save(user).getNotificationPreferences();
    }

    private User findUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationPreferences ensurePreferences(User user) {
        if (user.getNotificationPreferences() == null) {
            user.setNotificationPreferences(NotificationPreferences.defaultPreferences());
            return userRepository.save(user).getNotificationPreferences();
        }
        return user.getNotificationPreferences();
    }
}
