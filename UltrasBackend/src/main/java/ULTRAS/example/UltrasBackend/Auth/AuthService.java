package ULTRAS.example.UltrasBackend.Auth;

import ULTRAS.example.UltrasBackend.Common.ApiException;
import ULTRAS.example.UltrasBackend.User.User;
import ULTRAS.example.UltrasBackend.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.email());

        if (userRepo.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }

        // If the frontend didn't send a username, derive one from displayName +
        // a numeric suffix until it's unique. Cheap, predictable, no extra round trip.
        String username = (req.username() == null || req.username().isBlank())
                ? deriveUniqueUsername(req.displayName())
                : normalizeUsername(req.username());

        if (userRepo.existsByUsernameIgnoreCase(username)) {
            throw new ApiException(HttpStatus.CONFLICT, "Username already taken");
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(req.password()))
                .city(req.city())
                .tier(User.Tier.ROOKIE)
                .xpTotal(0)
                .build();

        user = userRepo.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmailIgnoreCase(normalizeEmail(req.email()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return buildResponse(user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {
        User user = userRepo.findByEmailIgnoreCase(normalizeEmail(req.email()))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No account found for that email"));

        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepo.save(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtService.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getTier().name(),
                user.getXpTotal()
        );
    }

    /** Lowercase, strip non-alphanum, append a 4-digit suffix until unique. */
    private String deriveUniqueUsername(String displayName) {
        String base = displayName.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "");
        if (base.isEmpty()) base = "supporter";
        if (base.length() > 24) base = base.substring(0, 24);

        // Try the base first, then base + a few random suffixes.
        if (!userRepo.existsByUsernameIgnoreCase(base)) return base;
        for (int i = 0; i < 8; i++) {
            String candidate = base + (1000 + (int)(Math.random() * 9000));
            if (!userRepo.existsByUsernameIgnoreCase(candidate)) return candidate;
        }
        // Extremely unlikely fallback.
        return base + System.currentTimeMillis();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }
}
