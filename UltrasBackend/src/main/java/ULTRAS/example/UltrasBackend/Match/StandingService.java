package ULTRAS.example.UltrasBackend.Match;

import ULTRAS.example.UltrasBackend.Common.ApiException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class StandingService {

    private static final Logger log = LoggerFactory.getLogger(StandingService.class);

    private final ApiFootballClient client;

    @Value("${apifootball.liga1.league-id:274}")
    private int liga1LeagueId;

    @Value("${apifootball.liga1.season:2025}")
    private int liga1Season;

    @Value("${apifootball.cache.standings-ttl-minutes:30}")
    private long standingsTtlMinutes;

    private record Snapshot(List<StandingDtos.FrontendStanding> rows, Instant fetchedAt) {}

    private final AtomicReference<Snapshot> snapshot = new AtomicReference<>();

    public List<StandingDtos.FrontendStanding> getLiga1Standings() {
        Snapshot current = snapshot.get();
        Duration ttl = Duration.ofMinutes(standingsTtlMinutes);

        if (current == null || Duration.between(current.fetchedAt(), Instant.now()).compareTo(ttl) > 0) {
            try {
                List<StandingDtos.FrontendStanding> fresh = fetchAndMap(liga1LeagueId, liga1Season);
                Snapshot next = new Snapshot(fresh, Instant.now());
                snapshot.set(next);
                return fresh;
            } catch (ApiException ex) {
                if (current != null) {
                    log.warn("Standings refresh failed; serving cached snapshot from {}: {}",
                            current.fetchedAt(), ex.getMessage());
                    return current.rows();
                }
                throw ex;
            }
        }
        return current.rows();
    }

    /** Force-refresh ignoring TTL. Returns the new row count. */
    public int forceSync() {
        List<StandingDtos.FrontendStanding> fresh = fetchAndMap(liga1LeagueId, liga1Season);
        snapshot.set(new Snapshot(fresh, Instant.now()));
        return fresh.size();
    }

    private List<StandingDtos.FrontendStanding> fetchAndMap(int leagueId, int season) {
        StandingDtos.ApiStandingsResponse resp = client.fetchStandings(leagueId, season);
        if (resp == null || resp.response() == null || resp.response().isEmpty()) {
            return Collections.emptyList();
        }
        StandingDtos.StandingsLeague league = resp.response().get(0).league();
        if (league == null || league.standings() == null || league.standings().isEmpty()) {
            return Collections.emptyList();
        }
        // Liga 1 is single-group, so flatten [0]. If we ever care about groups we'll
        // need a multi-group DTO — for now the frontend assumes one flat table.
        List<StandingDtos.StandingItem> items = league.standings().get(0);
        if (items == null) return Collections.emptyList();

        return items.stream()
                .filter(i -> i != null && i.team() != null)
                .sorted((a, b) -> {
                    int ra = a.rank() == null ? Integer.MAX_VALUE : a.rank();
                    int rb = b.rank() == null ? Integer.MAX_VALUE : b.rank();
                    return Integer.compare(ra, rb);
                })
                .map(StandingDtos.FrontendStanding::from)
                .toList();
    }

    /**
     * Look up a single team's standing row by slug. Used by the team-detail page
     * so we can show "currently 5th, 42 pts" alongside the fixture lists.
     * Returns null if the team isn't in the standings yet (e.g. promoted club
     * before season start).
     */
    public StandingDtos.FrontendStanding findBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Team slug is required");
        }
        return getLiga1Standings().stream()
                .filter(s -> slug.equalsIgnoreCase(s.teamId()))
                .findFirst()
                .orElse(null);
    }
}
