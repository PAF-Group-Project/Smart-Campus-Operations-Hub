package com.groupxx.smartcampus.user;

import com.groupxx.smartcampus.preferences.NotificationPreferences;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class DemoUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedIfMissing("System Admin", "admin@smartcampus.com", "Admin123!", Role.ADMIN);
        seedIfMissing("Admin User", "admin@university.edu", "admin123", Role.ADMIN);
        seedIfMissing("Demo Student", "user@smartcampus.com", "User123!", Role.USER);
        
        // Force update for technician to match TECH001
        userRepository.findByEmail("tech@smartcampus.com").ifPresent(user -> {
            if (!"TECH001".equals(user.getId())) {
                userRepository.delete(user);
            }
        });
        
        // Mike Johnson / tech@smartcampus.com with specific ID for frontend matching
        seedWithId("TECH001", "Mike Johnson", "tech@smartcampus.com", "Tech123!", Role.TECHNICIAN);
    }

    private void seedWithId(String id, String name, String email, String password, Role role) {
        userRepository.findById(id).ifPresent(userRepository::delete);
        
        User user = User.builder()
                .id(id)
                .name(name)
                .email(email.toLowerCase(Locale.ROOT))
                .provider("local")
                .role(role)
                .notificationPreferences(NotificationPreferences.defaultPreferences())
                .passwordHash(passwordEncoder.encode(password))
                .build();
        userRepository.save(user);
    }

    private void seedIfMissing(String name, String email, String rawPassword, Role role) {
        String normalizedEmail = email.toLowerCase(Locale.ROOT);
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            return;
        }

        User user = User.builder()
                .name(name)
                .email(normalizedEmail)
                .provider("local")
                .role(role)
                .notificationPreferences(NotificationPreferences.defaultPreferences())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .build();

        userRepository.save(user);
    }
}
