package com.groupxx.smartcampus.preferences;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferences {
    @Builder.Default
    private Boolean bookingNotifications = true;
    @Builder.Default
    private Boolean ticketNotifications = true;
    @Builder.Default
    private Boolean commentNotifications = true;
    @Builder.Default
    private Boolean systemNotifications = true;

    public static NotificationPreferences defaultPreferences() {
        return NotificationPreferences.builder().build();
    }

    public static NotificationPreferences normalized(NotificationPreferences preferences) {
        if (preferences == null) {
            return defaultPreferences();
        }

        return NotificationPreferences.builder()
                .bookingNotifications(preferences.getBookingNotifications() != null
                        ? preferences.getBookingNotifications()
                        : true)
                .ticketNotifications(preferences.getTicketNotifications() != null
                        ? preferences.getTicketNotifications()
                        : true)
                .commentNotifications(preferences.getCommentNotifications() != null
                        ? preferences.getCommentNotifications()
                        : true)
                .systemNotifications(preferences.getSystemNotifications() != null
                        ? preferences.getSystemNotifications()
                        : true)
                .build();
    }
}
