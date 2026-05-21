package ULTRAS.example.UltrasBackend.Auth;

import java.util.UUID;

public record AuthResponse(
        String token,
        UUID userId,
        String username,
        String email,
        String tier,
        int xpTotal
) {}

