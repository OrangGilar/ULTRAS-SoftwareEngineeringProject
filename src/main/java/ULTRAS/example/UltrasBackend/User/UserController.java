package ULTRAS.example.UltrasBackend.User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Get your own profile (includes equipped cosmetics)
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(@RequestAttribute UUID userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    // Get any user's public profile
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> profile(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }

    // Update your city
    @PatchMapping("/me/city")
    public ResponseEntity<User> updateCity(@RequestAttribute UUID userId,
                                           @RequestParam String city) {
        return ResponseEntity.ok(userService.updateCity(userId, city));
    }
}

