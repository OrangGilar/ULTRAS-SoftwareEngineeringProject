package ULTRAS.example.UltrasBackend.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 2, max = 32) String displayName,
        @NotBlank @Size(min = 8, max = 100) String password,
        String username,   // optional — derived from displayName if blank
        String city        // optional
) {}
