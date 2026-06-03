package ULTRAS.example.UltrasBackend.Match;

import ULTRAS.example.UltrasBackend.Common.ApiException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LiveScoreService {

    private static final Logger log = LoggerFactory.getLogger(LiveScoreService.class);

    private final ApiFootballClient client;
    private final MatchRepository matchRepo;
    private final ObjectMapper objectMapper;

    @Value("${apifootball.liga1.league-id:274}")
    private int liga1LeagueId;

    @Value("${apifootball.liga1.season:2026}")
    private int liga1Season;

    @Value("${apifootball.cache.fixtures-ttl-minutes:15}")
    private long fixturesTtlMinutes;

    @Value("${apifootball.cache.live-ttl-seconds:60}")
    private long liveTtlSeconds;

    // ===== Original (backend-shape) methods =====

    @Transactional
    public List<MatchDtos.MatchResponse> getLiga1Fixtures() {
        refreshIfStale(liga1LeagueId, liga1Season);
        return matchRepo.findByLeagueIdOrderByKickoffAtAsc(liga1LeagueId)
                .stream().map(MatchDtos.MatchResponse::from).toList();
    }

    @Transactional
    public List<MatchDtos.MatchResponse> getLiveLiga1() {
        refreshIfStale(liga1LeagueId, liga1Season);
        return matchRepo.findLive().stream()
                .filter(m -> m.getLeagueId() != null && m.getLeagueId() == liga1LeagueId)
                .map(MatchDtos.MatchResponse::from)
                .toList();
    }

    public MatchDtos.MatchResponse getById(UUID id) {
        MatchEntity m = matchRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Match not found"));
        return MatchDtos.MatchResponse.from(m);
    }

    // ===== Frontend-shape variants =====

    /**
     * Returns Liga 1 fixtures in the shape app/types/index.ts expects.
     * Same caching/refresh policy as getLiga1Fixtures().
     */
    @Transactional
    public List<MatchDtos.FrontendMatch> getLiga1FixturesForFrontend() {
        refreshIfStale(liga1LeagueId, liga1Season);
        return matchRepo.findByLeagueIdOrderByKickoffAtAsc(liga1LeagueId)
                .stream().map(MatchDtos.FrontendMatch::from).toList();
    }

    @Transactional
    public List<MatchDtos.FrontendMatch> getLiveLiga1ForFrontend() {
        refreshIfStale(liga1LeagueId, liga1Season);
        return matchRepo.findLive().stream()
                .filter(m -> m.getLeagueId() != null && m.getLeagueId() == liga1LeagueId)
                .map(MatchDtos.FrontendMatch::from)
                .toList();
    }

    /**
     * Frontend IDs are the API fixture ID as a string (see FrontendMatch.from).
     * We accept that string here and resolve it back to an entity.
     */
    public MatchDtos.FrontendMatch getByFrontendIdForFrontend(String id) {
        MatchEntity m;
        try {
            // Frontend IDs are numeric (API fixture ID)
            long apiId = Long.parseLong(id);
            m = matchRepo.findByApiFixtureId(apiId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Match not found"));
        } catch (NumberFormatException ex) {
            // Allow lookup by internal UUID too, as a graceful fallback.
            try {
                m = matchRepo.findById(UUID.fromString(id))
                        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Match not found"));
            } catch (IllegalArgumentException iae) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid match id: " + id);
            }
        }
        return MatchDtos.FrontendMatch.from(m);
    }

    /**
     * The dataset is small (one league season, ~306 fixtures) so an in-memory
     * filter beats adding a slug column and recomputing it on every sync.
     */
    @Transactional
    public List<MatchDtos.FrontendMatch> getMatchesForTeamSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Team slug is required");
        }
        refreshIfStale(liga1LeagueId, liga1Season);
        String target = slug.toLowerCase();
        return matchRepo.findByLeagueIdOrderByKickoffAtAsc(liga1LeagueId).stream()
                .filter(m -> target.equals(MatchDtos.teamSlug(m.getHomeTeamName()))
                        || target.equals(MatchDtos.teamSlug(m.getAwayTeamName())))
                .map(MatchDtos.FrontendMatch::from)
                .toList();
    }

    // ===== Sync =====

    @Transactional
    public int forceSync() { return syncFromApi(liga1LeagueId, liga1Season); }

    private void refreshIfStale(int leagueId, int season) {
        if (!client.isEnabled()) return;

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime lastSync = matchRepo.findLastSyncForLeague(leagueId).orElse(null);

        boolean anyLive = !matchRepo.findLive().isEmpty();
        Duration ttl = anyLive ? Duration.ofSeconds(liveTtlSeconds) : Duration.ofMinutes(fixturesTtlMinutes);

        if (lastSync == null || Duration.between(lastSync, now).compareTo(ttl) > 0) {
            try {
                syncFromApi(leagueId, season);
            } catch (ApiException ex) {
                log.warn("Sync failed; serving cached data: {}", ex.getMessage());
            }
        }
    }

    private int syncFromApi(int leagueId, int season) {
        MatchDtos.ApiFootballResponse resp = client.fetchFixturesForSeason(leagueId, season);
        if (resp == null || resp.response() == null) return 0;

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        int count = 0;
        for (MatchDtos.FixtureItem item : resp.response()) {
            upsert(item, now);
            count++;
        }
        log.info("Synced {} fixtures for league {} season {}", count, leagueId, season);
        return count;
    }

    private void upsert(MatchDtos.FixtureItem item, OffsetDateTime now) {
        if (item == null || item.fixture() == null || item.fixture().id() == null) return;

        Long apiId = item.fixture().id();
        MatchEntity entity = matchRepo.findByApiFixtureId(apiId).orElseGet(MatchEntity::new);

        entity.setApiFixtureId(apiId);
        if (item.league() != null) {
            entity.setLeagueId(item.league().id());
            entity.setLeagueName(item.league().name());
            entity.setLeagueRound(item.league().round());
            entity.setSeason(item.league().season());
        }
        if (item.teams() != null) {
            if (item.teams().home() != null) {
                entity.setHomeTeamId(item.teams().home().id());
                entity.setHomeTeamName(item.teams().home().name());
                entity.setHomeTeamLogo(item.teams().home().logo());
            }
            if (item.teams().away() != null) {
                entity.setAwayTeamId(item.teams().away().id());
                entity.setAwayTeamName(item.teams().away().name());
                entity.setAwayTeamLogo(item.teams().away().logo());
            }
        }
        if (item.goals() != null) {
            entity.setHomeScore(item.goals().home());
            entity.setAwayScore(item.goals().away());
        }
        if (item.fixture().status() != null) {
            entity.setStatus(item.fixture().status().shortCode());
            entity.setStatusElapsed(item.fixture().status().elapsed());
        } else {
            entity.setStatus("NS");
        }
        if (item.fixture().date() != null) {
            try { entity.setKickoffAt(OffsetDateTime.parse(item.fixture().date())); }
            catch (Exception ex) { log.debug("Couldn't parse kickoff date '{}'", item.fixture().date()); }
        }
        if (item.fixture().venue() != null) entity.setVenue(item.fixture().venue().name());
        try {
            entity.setRawPayload(objectMapper.writeValueAsString(item));
        } catch (JsonProcessingException e) {
            log.warn("Could not serialize raw payload for fixture {}", apiId);
        }
        entity.setLastSyncedAt(now);
        matchRepo.save(entity);
    }
}
