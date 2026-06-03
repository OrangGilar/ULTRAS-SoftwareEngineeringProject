package ULTRAS.example.UltrasBackend.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserCosmeticRepository extends JpaRepository<UserCosmetic, UUID> {
    List<UserCosmetic> findByUserId(UUID userId);
    Optional<UserCosmetic> findByUserIdAndCosmeticId(UUID userId, UUID cosmeticId);
    boolean existsByUserIdAndCosmeticId(UUID userId, UUID cosmeticId);

    // Find what's currently equipped per type (e.g. only one frame active at a time)
    List<UserCosmetic> findByUserIdAndIsEquippedTrue(UUID userId);

}
