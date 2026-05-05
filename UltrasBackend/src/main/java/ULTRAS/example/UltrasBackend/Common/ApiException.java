package ULTRAS.example.UltrasBackend.Common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Domain-level exception. Carries the HTTP status the client should see —
 * the GlobalExceptionHandler translates it into a clean JSON response.
 */
@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
