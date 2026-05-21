package ULTRAS.example.UltrasBackend.Cosmetic;

import ULTRAS.example.UltrasBackend.Engagement.EngagementService;
import ULTRAS.example.UltrasBackend.User.UserCosmetic;
import ULTRAS.example.UltrasBackend.User.UserCosmeticRepository;
import ULTRAS.example.UltrasBackend.User.User;
import ULTRAS.example.UltrasBackend.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CosmeticService {

    private final CosmeticRepository cosmeticRepo;
    private final UserCosmeticRepository userCosmeticRepo;
    private final UserRepository userRepo;
    private final EngagementService engagementService;

    // Browse all available cosmetics (optionally filter by type or club)
    public List<CosmeticItem> getAll(String clubTag, CosmeticItem.CosmeticType type) {
        if (clubTag != null) return cosmeticRepo.findByClubTagAndIsActiveTrue(clubTag);
        if (type != null)    return cosmeticRepo.findByTypeAndIsActiveTrue(type);
        return cosmeticRepo.findByIsActiveTrue();
    }

    // Get all cosmetics a user owns
    public List<UserCosmetic> getUserCollection(UUID userId) {
        return userCosmeticRepo.findByUserId(String.valueOf(userId));
    }

    // Spend XP to unlock a cosmetic
    @Transactional
    public UserCosmetic purchase(UUID userId, UUID cosmeticId) {
        if (userCosmeticRepo.existsByUserIdAndCosmeticId(userId, cosmeticId))
            throw new RuntimeException("You already own this cosmetic");

        CosmeticItem item = cosmeticRepo.findById(cosmeticId)
                .orElseThrow(() -> new RuntimeException("Cosmetic not found"));

        if (!item.isActive())
            throw new RuntimeException("Cosmetic is no longer available");

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check tier requirement
        if (item.getRequiredTier() != null && !meetsTierRequirement(user.getTier(), item.getRequiredTier()))
            throw new RuntimeException("Your tier is too low to unlock this cosmetic. Required: " + item.getRequiredTier());

        // Check and deduct XP
        if (user.getXpTotal() < item.getXpCost())
            throw new RuntimeException("Not enough XP. Need " + item.getXpCost() + ", have " + user.getXpTotal());

        // Deduct XP (negative award)
        engagementService.awardXp(userId, -item.getXpCost(), "COSMETIC_PURCHASE:" + item.getName());

        UserCosmetic uc = UserCosmetic.builder()
                .userId(userId)
                .cosmeticId(cosmeticId)
                .isEquipped(false)
                .build();

        return userCosmeticRepo.save(uc);
    }

    // Equip a cosmetic — unequips any other of the same type first
    @Transactional
    public UserCosmetic equip(UUID userId, UUID cosmeticId) {
        UserCosmetic owned = userCosmeticRepo
                .findByUserIdAndCosmeticId(userId, cosmeticId)
                .orElseThrow(() -> new RuntimeException("You don't own this cosmetic"));

        CosmeticItem item = cosmeticRepo.findById(cosmeticId).orElseThrow();

        // Unequip all other cosmetics of the same type
        userCosmeticRepo.findByUserIdAndIsEquippedTrue(userId).stream()
                .filter(uc -> {
                    CosmeticItem other = cosmeticRepo.findById(uc.getCosmeticId()).orElseThrow();
                    return other.getType() == item.getType();
                })
                .forEach(uc -> {
                    uc.setEquipped(false);
                    userCosmeticRepo.save(uc);
                });

        owned.setEquipped(true);
        return userCosmeticRepo.save(owned);
    }

    // Unequip a cosmetic
    @Transactional
    public UserCosmetic unequip(UUID userId, UUID cosmeticId) {
        UserCosmetic owned = userCosmeticRepo
                .findByUserIdAndCosmeticId(userId, cosmeticId)
                .orElseThrow(() -> new RuntimeException("You don't own this cosmetic"));

        owned.setEquipped(false);
        return userCosmeticRepo.save(owned);
    }

    // Admin: add a new cosmetic to the shop
    public CosmeticItem createItem(CosmeticItemRequest req) {
        CosmeticItem item = CosmeticItem.builder()
                .name(req.name())
                .description(req.description())
                .type(req.type())
                .imageUrl(req.imageUrl())
                .xpCost(req.xpCost())
                .requiredTier(req.requiredTier())
                .clubTag(req.clubTag())
                .isActive(true)
                .build();
        return cosmeticRepo.save(item);
    }

    // Helper: check if user's tier meets the requirement
    private boolean meetsTierRequirement(User.Tier userTier, CosmeticItem.RequiredTier required) {
        int userLevel = tierLevel(userTier.name());
        int reqLevel  = tierLevel(required.name());
        return userLevel >= reqLevel;
    }

    private int tierLevel(String tier) {
        return switch (tier) {
            case "ROOKIE"  -> 0;
            case "FAN"     -> 1;
            case "ULTRAS"  -> 2;
            case "LEGEND"  -> 3;
            default -> 0;
        };
    }
}

record CosmeticItemRequest(
        String name,
        String description,
        CosmeticItem.CosmeticType type,
        String imageUrl,
        int xpCost,
        CosmeticItem.RequiredTier requiredTier,
        String clubTag
) {}

