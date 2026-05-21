package ULTRAS.example.UltrasBackend.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_cosmetics",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "cosmetic_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCosmetic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "cosmetic_id", nullable = false)
    private UUID cosmeticId;

    // Whether this cosmetic is currently equipped on the user's profile
    @Column(name = "is_equipped", nullable = false)
    private boolean isEquipped = false;

    @Column(name = "unlocked_at")
    private OffsetDateTime unlockedAt;

    @PrePersist
    protected void onCreate() { this.unlockedAt = OffsetDateTime.now(); }
}

