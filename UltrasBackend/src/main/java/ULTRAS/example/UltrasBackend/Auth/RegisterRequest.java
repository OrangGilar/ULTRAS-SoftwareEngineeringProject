package ULTRAS.example.UltrasBackend.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 2, max = 32) String displayName,
        @NotBlank @Size(min = 8, max = 100) String password,
        @Size(min = 3, max = 24)
        @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Username can only use letters, numbers, and underscores")
        String username,
        String city
) {}
