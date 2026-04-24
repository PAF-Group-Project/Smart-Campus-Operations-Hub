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
    private boolean bookingNotifications = true;
    @Builder.Default
    private boolean ticketNotifications = true;
    @Builder.Default
    private boolean commentNotifications = true;
    @Builder.Default
    private boolean systemNotifications = true;

    public static NotificationPreferences defaultPreferences() {
        return NotificationPreferences.builder().build();
    }
}
