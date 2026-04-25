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
        seedIfMissing("Demo Student", "user@smartcampus.com", "User123!", Role.USER);
        seedIfMissing("Demo Technician", "tech@smartcampus.com", "Tech123!", Role.TECHNICIAN);
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
