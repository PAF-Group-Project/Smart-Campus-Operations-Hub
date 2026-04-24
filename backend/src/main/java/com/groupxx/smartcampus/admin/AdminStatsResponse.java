package com.groupxx.smartcampus.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalAdmins;
    private long totalTechnicians;
    private long totalNotifications;
    private long unreadNotifications;
}
