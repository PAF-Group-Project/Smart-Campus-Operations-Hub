package com.smartcampus.booking.repository;

import com.smartcampus.booking.domain.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BookingRepositoryImpl implements BookingRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Booking> findAdminBookings(String status, String resourceId, String startDate, String endDate) {
        Query query = new Query();
        
        if (status != null && !status.trim().isEmpty()) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        
        if (resourceId != null && !resourceId.trim().isEmpty()) {
            query.addCriteria(Criteria.where("resourceId").is(resourceId));
        }
        
        if (startDate != null && !startDate.trim().isEmpty() && endDate != null && !endDate.trim().isEmpty()) {
            query.addCriteria(Criteria.where("date").gte(startDate).lte(endDate));
        } else if (startDate != null && !startDate.trim().isEmpty()) {
            query.addCriteria(Criteria.where("date").gte(startDate));
        } else if (endDate != null && !endDate.trim().isEmpty()) {
            query.addCriteria(Criteria.where("date").lte(endDate));
        }
        
        return mongoTemplate.find(query, Booking.class);
    }
}
