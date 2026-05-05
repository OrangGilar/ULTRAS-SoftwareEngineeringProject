package ULTRAS.example.UltrasBackend.Engagement;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "predictions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "match_id"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Prediction {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "match_id", nullable = false)
    private String matchId;

    @Column(name = "home_score", nullable = false)
    private int homeScore;

    @Column(name = "away_score", nullable = false)
    private int awayScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Result result = Result.PENDING;

    @Column(name = "xp_awarded", nullable = false)
    private int xpAwarded = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = OffsetDateTime.now(); }

    public enum Result { PENDING, CORRECT, INCORRECT }
}
