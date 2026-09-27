package com.azure.keyvault.auth.service;

import com.azure.keyvault.auth.dto.*;
import com.azure.keyvault.auth.entity.Role;
import com.azure.keyvault.auth.entity.User;
import com.azure.keyvault.auth.repository.UserRepository;
import com.azure.keyvault.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole() != null ? request.getRole() : Role.DEVELOPER)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDto(savedUser))
                .build();
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
