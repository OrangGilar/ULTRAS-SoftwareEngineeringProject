package ULTRAS.example.UltrasBackend.Auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

/**
 * Reads the Authorization header, verifies the JWT, and stores the user's UUID
 * BOTH in the SecurityContext (so @AuthenticationPrincipal works) AND as a
 * request attribute named "userId" (so existing controllers using
 * @RequestAttribute UUID userId keep working without churn).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";
    public  static final String USER_ID_ATTR = "userId";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader(HEADER);
        if (header == null || !header.startsWith(PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(PREFIX.length());

        try {
            if (jwtService.isValid(token)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UUID userId = jwtService.extractUserId(token);

                // Make @RequestAttribute UUID userId resolve. This is the line your
                // existing controllers depend on — without it they throw 400.
                request.setAttribute(USER_ID_ATTR, userId);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.emptyList()
                        );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ignored) {
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
    }
}
