package ULTRAS.example.UltrasBackend.Common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Global CORS configuration. The Next.js dev server runs on http://localhost:3000
 * by default; in production, set ultras.cors.allowed-origins to your real frontend URL.
 *
 * The bean is wired into Spring Security via SecurityConfig#securityFilterChain
 * (http.cors(...)). Don't add @CrossOrigin annotations on individual controllers —
 * one source of truth is easier to reason about.
 */
@Configuration
public class CorsConfig {

    @Value("${ultras.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        // Comma-separated list from properties → List<String>.
        // Use allowedOriginPatterns (not allowedOrigins) so we can pair it with
        // allowCredentials=true if you ever switch from Bearer tokens to cookies.
        cfg.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split("\\s*,\\s*")));

        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L); // cache preflight for an hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cfg);
        return source;
    }
}
