package com.groupxx.smartcampus.config;

import com.groupxx.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserCheckRunner implements CommandLineRunner {
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        System.out.println("--- Current Users in Database ---");
        userRepository.findAll().forEach(user -> {
            System.out.println("ID: " + user.getId() + " | Email: " + user.getEmail() + " | Role: " + user.getRole());
        });
        System.out.println("---------------------------------");
    }
}
