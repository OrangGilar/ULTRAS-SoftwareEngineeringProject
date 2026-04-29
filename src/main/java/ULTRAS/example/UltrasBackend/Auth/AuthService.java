package ULTRAS.example.UltrasBackend.Auth;

import ULTRAS.example.UltrasBackend.User.UserRepository;
import ULTRAS.example.UltrasBackend.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.email()))
            throw new RuntimeException("Email already registered");

        User user = User.builder()
                .email(req.email())
                .username(req.username())
                .password(encoder.encode(req.password()))
                .city(req.city())
                .build();

        userRepo.save(user);
        String token = jwtUtil.generate(user.getEmail(), user.getId().toString());
        return new AuthResponse(token, user.getUsername(), user.getTier().name());
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        User user = userRepo.findByEmail(req.email()).orElseThrow();
        String token = jwtUtil.generate(user.getEmail(), user.getId().toString());
        return new AuthResponse(token, user.getUsername(), user.getTier().name());
    }
}

record RegisterRequest(String email, String username, String password, String city) {}
record LoginRequest(String email, String password) {}
record AuthResponse(String token, String username, String tier) {}