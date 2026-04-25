package com.groupxx.smartcampus.notification.dto;

import com.groupxx.smartcampus.notification.NotificationType;
import lombok.Data;

@Data
public class TestNotificationRequest {
    private String title;
    private String message;
    private NotificationType type;
}
