package ULTRAS.example.UltrasBackend.Xp;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "xp_transactions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class XpTransaction {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    // Negative values = XP spent (e.g. cosmetic purchase)
    @Column(nullable = false)
    private int amount;

    @Column(nullable = false)
    private String reason;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = OffsetDateTime.now(); }

    // XP constants
    public static final int XP_CORRECT_PREDICTION = 100;
    public static final int XP_COMMUNITY_POST      = 10;
}
