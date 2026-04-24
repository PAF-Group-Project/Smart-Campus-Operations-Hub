package com.smartcampus.booking;

import com.smartcampus.booking.domain.Booking;
import com.smartcampus.booking.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;

@SpringBootApplication
@EnableScheduling
public class BookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(BookingRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Booking b1 = new Booking();
                b1.setResourceId("RES-001");
                b1.setUserId("USR-101");
                b1.setUserEmail("student@sliit.lk");
                b1.setUserName("John Doe");
                b1.setDate("2026-03-30");
                b1.setStartTime("09:00");
                b1.setEndTime("11:00");
                b1.setPurpose("Project Presentation");
                b1.setExpectedAttendees(50);
                b1.setStatus("APPROVED");
                b1.setQrCodeToken("dummy-qr-1234");
                b1.setCheckedIn(false);

                Booking b2 = new Booking();
                b2.setResourceId("RES-002");
                b2.setUserId("USR-102");
                b2.setUserEmail("jane@sliit.lk");
                b2.setUserName("Jane Smith");
                b2.setDate("2026-03-31");
                b2.setStartTime("14:00");
                b2.setEndTime("15:30");
                b2.setPurpose("Team Meeting");
                b2.setExpectedAttendees(5);
                b2.setStatus("PENDING");

                Booking b3 = new Booking();
                b3.setResourceId("RES-003");
                b3.setUserId("USR-101");
                b3.setUserEmail("student@sliit.lk");
                b3.setUserName("John Doe");
                b3.setDate("2026-04-01");
                b3.setStartTime("10:00");
                b3.setEndTime("12:00");
                b3.setPurpose("Lab Session");
                b3.setExpectedAttendees(20);
                b3.setStatus("REJECTED");
                b3.setRejectionReason("Lab is under maintenance");

                repository.saveAll(List.of(b1, b2, b3));
            }
        };
    }

    @Bean
    public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
        return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*").allowedHeaders("*");
            }
        };
    }
}
