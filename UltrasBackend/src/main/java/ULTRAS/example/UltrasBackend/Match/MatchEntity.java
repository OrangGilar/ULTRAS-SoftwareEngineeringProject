package ULTRAS.example.UltrasBackend.Match;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "matches",
        uniqueConstraints = @UniqueConstraint(columnNames = "api_fixture_id"),
        indexes = {
                @Index(name = "idx_matches_kickoff", columnList = "kickoff_at"),
                @Index(name = "idx_matches_status",  columnList = "status")
        }
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "api_fixture_id", nullable = false)
    private Long apiFixtureId;

    @Column(name = "league_id", nullable = false)
    private Integer leagueId;

    @Column(name = "league_name")
    private String leagueName;

    @Column(name = "league_round")
    private String leagueRound;

    @Column(name = "season")
    private Integer season;

    @Column(name = "home_team_id")
    private Integer homeTeamId;

    @Column(name = "home_team_name")
    private String homeTeamName;

    @Column(name = "home_team_logo")
    private String homeTeamLogo;

    @Column(name = "away_team_id")
    private Integer awayTeamId;

    @Column(name = "away_team_name")
    private String awayTeamName;

    @Column(name = "away_team_logo")
    private String awayTeamLogo;

    @Column(name = "home_score")
    private Integer homeScore;

    @Column(name = "away_score")
    private Integer awayScore;

    @Column(name = "status", nullable = false, length = 8)
    private String status;

    @Column(name = "status_elapsed")
    private Integer statusElapsed;

    @Column(name = "kickoff_at")
    private OffsetDateTime kickoffAt;

    @Column(name = "venue")
    private String venue;

    @Column(name = "raw_payload", columnDefinition = "TEXT")
    private String rawPayload;

    @Column(name = "last_synced_at", nullable = false)
    private OffsetDateTime lastSyncedAt;

    public boolean isLive() {
        if (status == null) return false;
        return switch (status) {
            case "1H", "2H", "HT", "ET", "BT", "P", "LIVE", "SUSP", "INT" -> true;
            default -> false;
        };
    }
}
