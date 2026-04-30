package ULTRAS.example.UltrasBackend.Cosmetic;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cosmetic_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CosmeticItem {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CosmeticType type;  // AVATAR, BADGE, PROFILE_FRAME

    @Column(name = "image_url")
    private String imageUrl;

    // XP cost to purchase — 0 means milestone unlock only
    @Column(name = "xp_cost", nullable = false)
    private int xpCost;

    // If set, user must be this tier or above to unlock
    @Enumerated(EnumType.STRING)
    @Column(name = "required_tier")
    private RequiredTier requiredTier;

    // Club association — null means available to all fans
    @Column(name = "club_tag")
    private String clubTag;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = OffsetDateTime.now(); }

    public enum CosmeticType {
        AVATAR,         // profile picture frame/base
        BADGE,          // shown on profile and posts
        PROFILE_FRAME   // decorative border around avatar
    }

    public enum RequiredTier {
        ROOKIE, FAN, ULTRAS, LEGEND
    }
}

