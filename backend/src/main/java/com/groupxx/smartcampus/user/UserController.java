package com.groupxx.smartcampus.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody RoleUpdateRequest request) {
        return userRepository.findById(id).map(user -> {
            user.setRole(request.getRole());
            userRepository.save(user);
            return ResponseEntity.ok("Role updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}

class RoleUpdateRequest {
    private Role role;
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
