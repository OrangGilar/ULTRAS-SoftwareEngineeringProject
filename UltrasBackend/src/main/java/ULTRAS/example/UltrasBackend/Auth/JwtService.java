package ULTRAS.example.UltrasBackend.Auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

/**
 * Issues and verifies JWTs. Subject = user UUID; we add username as a claim
 * for convenience (so the filter doesn't need a DB hit just to know who you are).
 */
@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${ultras.jwt.secret}") String secret,
            @Value("${ultras.jwt.expiration-ms}") long expirationMs
    ) {
        // Secret must be base64-encoded and decode to >= 32 bytes for HS256.
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
    }

    public String generateToken(UUID userId, String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("username", username)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    /** Returns the user UUID from a valid token, or throws if invalid/expired. */
    public UUID extractUserId(String token) {
        return UUID.fromString(parse(token).getPayload().getSubject());
    }

    public String extractUsername(String token) {
        return parse(token).getPayload().get("username", String.class);
    }

    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token);
    }
}

