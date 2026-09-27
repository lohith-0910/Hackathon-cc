package com.azure.keyvault.auth.config;

import com.azure.keyvault.auth.entity.Role;
import com.azure.keyvault.auth.entity.User;
import com.azure.keyvault.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUser("admin", "admin@example.com", "admin123", "System Administrator", Role.ADMIN);
            seedUser("security_admin", "security@example.com", "security123", "Security Architect", Role.SECURITY_ADMIN);
            seedUser("developer", "developer@example.com", "dev123", "Senior Developer", Role.DEVELOPER);
            seedUser("viewer", "viewer@example.com", "viewer123", "Audit Inspector", Role.VIEWER);
        }
    }

    private void seedUser(String username, String email, String rawPassword, String fullName, Role role) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .fullName(fullName)
                .role(role)
                .enabled(true)
                .build();
        userRepository.save(user);
    }
}
