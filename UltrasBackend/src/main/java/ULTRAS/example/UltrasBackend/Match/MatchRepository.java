package ULTRAS.example.UltrasBackend.Match;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MatchRepository extends JpaRepository<MatchEntity, UUID> {
    Optional<MatchEntity> findByApiFixtureId(Long apiFixtureId);
    List<MatchEntity> findByLeagueIdOrderByKickoffAtAsc(Integer leagueId);

    @Query("SELECT m FROM MatchEntity m WHERE m.status IN ('1H','2H','HT','ET','BT','P','LIVE','SUSP','INT')")
    List<MatchEntity> findLive();

    List<MatchEntity> findByStatusAndKickoffAtAfterOrderByKickoffAtAsc(String status, OffsetDateTime after);

    @Query("SELECT MAX(m.lastSyncedAt) FROM MatchEntity m WHERE m.leagueId = :leagueId")
    Optional<OffsetDateTime> findLastSyncForLeague(Integer leagueId);
}
