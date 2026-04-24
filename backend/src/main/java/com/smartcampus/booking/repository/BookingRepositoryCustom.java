package com.smartcampus.booking.repository;

import com.smartcampus.booking.domain.Booking;
import java.util.List;

public interface BookingRepositoryCustom {
    List<Booking> findAdminBookings(String status, String resourceId, String startDate, String endDate);
}
