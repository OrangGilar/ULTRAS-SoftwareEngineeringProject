package ULTRAS.example.UltrasBackend.User;

import ULTRAS.example.UltrasBackend.User.UserCosmetic;
import ULTRAS.example.UltrasBackend.User.UserCosmeticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final UserCosmeticRepository userCosmeticRepo;

    public User getById(UUID userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileResponse getProfile(UUID userId) {
        User user = getById(userId);

        // Get currently equipped cosmetics to show on profile
        List<UserCosmetic> equipped = userCosmeticRepo.findByUserIdAndIsEquippedTrue(userId);

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getCity(),
                user.getTier().name(),
                user.getXpTotal(),
                equipped
        );
    }

    public User updateCity(UUID userId, String city) {
        User user = getById(userId);
        user.setCity(city);
        return userRepo.save(user);
    }
}

record UserProfileResponse(
        UUID id,
        String username,
        String city,
        String tier,
        int xpTotal,
        List<UserCosmetic> equippedCosmetics
) {}

