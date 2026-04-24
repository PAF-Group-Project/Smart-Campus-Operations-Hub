package com.groupxx.smartcampus.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.groupxx.smartcampus.preferences.NotificationPreferences;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String avatar;
    private Role role;
    private String provider; // "google" or "local"
    private String googleId;
    @Builder.Default
    private NotificationPreferences notificationPreferences = NotificationPreferences.defaultPreferences();
    @JsonIgnore
    private String passwordHash;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
