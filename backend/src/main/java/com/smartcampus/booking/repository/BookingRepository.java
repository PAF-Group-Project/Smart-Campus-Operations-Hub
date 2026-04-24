package com.smartcampus.booking.repository;

import com.smartcampus.booking.domain.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String>, BookingRepositoryCustom {
    
    List<Booking> findByUserId(String userId);
    
    List<Booking> findByResourceIdAndDate(String resourceId, String date);
    
    Optional<Booking> findByQrCodeToken(String qrCodeToken);
    
    // Check for conflicting bookings for same resource, same date, overlapping time, and status pending/approved
    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "$and: [ {'startTime': { $lt: ?3 }}, {'endTime': { $gt: ?2 }} ] }")
    List<Booking> findConflictingBookings(String resourceId, String date, String newStartTime, String newEndTime);
}
