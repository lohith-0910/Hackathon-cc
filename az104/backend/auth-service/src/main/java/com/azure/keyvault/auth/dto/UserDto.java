package com.azure.keyvault.auth.dto;

import com.azure.keyvault.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
}
