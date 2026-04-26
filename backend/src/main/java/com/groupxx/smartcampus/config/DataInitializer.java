package com.groupxx.smartcampus.config;

import com.groupxx.smartcampus.user.Role;
import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Mike Johnson exists with the ID TECH001
        if (userRepository.findById("TECH001").isEmpty()) {
            User mike = User.builder()
                    .id("TECH001")
                    .name("Mike Johnson")
                    .email("mike@university.edu")
                    .role(Role.TECHNICIAN)
                    .provider("local")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .build();
            userRepository.save(mike);
            System.out.println("Initialized technician: Mike Johnson (TECH001)");
        }

        // Ensure an admin exists
        if (userRepository.findByEmail("admin@university.edu").isEmpty()) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@university.edu")
                    .role(Role.ADMIN)
                    .provider("local")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .build();
            userRepository.save(admin);
            System.out.println("Initialized admin user");
        }
    }
}
