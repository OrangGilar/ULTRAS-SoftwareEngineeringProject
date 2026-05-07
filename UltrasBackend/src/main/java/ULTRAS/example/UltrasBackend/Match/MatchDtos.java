package ULTRAS.example.UltrasBackend.Match;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Three DTO families live here:
 *
 *   1. {@link MatchResponse}        — the original backend-shaped payload.
 *                                     Useful for admin tooling / debugging.
 *
 *   2. {@link FrontendMatch}        — the shape the Next.js app expects, matching
 *                                     app/types/index.ts. This is what /api/matches
 *                                     should return by default.
 *
 *   3. ApiFootball* records         — Jackson bindings for the upstream provider.
 *
 * Mapping logic (status codes, team-name → slug) lives in static helpers below
 * so the controller stays a thin layer.
 */
public final class MatchDtos {

    private MatchDtos() {}

    // ---------- 1. Original backend shape (kept for /api/matches/raw) ----------

    public record MatchResponse(
            UUID id, Long apiFixtureId, Integer leagueId,
            String leagueName, String leagueRound,
            String homeTeamName, String homeTeamLogo,
            String awayTeamName, String awayTeamLogo,
            Integer homeScore, Integer awayScore,
            String status, Integer statusElapsed,
            OffsetDateTime kickoffAt, String venue, boolean live
    ) {
        public static MatchResponse from(MatchEntity m) {
            return new MatchResponse(
                    m.getId(), m.getApiFixtureId(), m.getLeagueId(),
                    m.getLeagueName(), m.getLeagueRound(),
                    m.getHomeTeamName(), m.getHomeTeamLogo(),
                    m.getAwayTeamName(), m.getAwayTeamLogo(),
                    m.getHomeScore(), m.getAwayScore(),
                    m.getStatus(), m.getStatusElapsed(),
                    m.getKickoffAt(), m.getVenue(), m.isLive()
            );
        }
    }

    // ---------- 2. Frontend-aligned shape (matches app/types/index.ts Match) ----------

    /** Mirrors the TS type: `{ home: number; away: number }`. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Score(int home, int away) {}

    /** Mirrors `Match` in app/types/index.ts. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record FrontendMatch(
            String id,
            String homeId,
            String awayId,
            String homeName,        // extra: lets the UI fall back when slug is unknown
            String awayName,        // extra: same
            String homeLogo,        // extra: API-Football crest URL
            String awayLogo,        // extra: same
            String kickoffISO,
            String venue,
            int matchday,
            String status,          // "upcoming" | "live" | "finished" | "postponed"
            Score finalScore        // null unless finished
    ) {
        public static FrontendMatch from(MatchEntity m) {
            return new FrontendMatch(
                    // Frontend `id` is a string. Use the API fixture ID — it's stable across
                    // syncs, unlike our internal UUID which can vary if you reset the DB.
                    m.getApiFixtureId() != null ? String.valueOf(m.getApiFixtureId())
                            : m.getId().toString(),
                    teamSlug(m.getHomeTeamName()),
                    teamSlug(m.getAwayTeamName()),
                    m.getHomeTeamName(),
                    m.getAwayTeamName(),
                    m.getHomeTeamLogo(),
                    m.getAwayTeamLogo(),
                    m.getKickoffAt() != null ? m.getKickoffAt().toString() : null,
                    m.getVenue(),
                    parseMatchday(m.getLeagueRound()),
                    mapStatus(m.getStatus()),
                    m.getStatus() != null && m.getStatus().equals("FT")
                            && m.getHomeScore() != null && m.getAwayScore() != null
                            ? new Score(m.getHomeScore(), m.getAwayScore())
                            : null
            );
        }
    }

    // ---------- Mapping helpers ----------

    /**
     * API-Football team-name → frontend club slug. Mirrors the IDs in
     * ultras-frontend/lib/mock/clubs.ts. Add entries here when you add clubs.
     * Falls back to a slugified name if no match — the frontend can show
     * homeName/awayName in that case.
     */
    private static final Map<String, String> TEAM_NAME_TO_SLUG = new HashMap<>();
    static {
        TEAM_NAME_TO_SLUG.put("persija jakarta",       "persija");
        TEAM_NAME_TO_SLUG.put("persib bandung",        "persib");
        TEAM_NAME_TO_SLUG.put("persebaya surabaya",    "persebaya");
        TEAM_NAME_TO_SLUG.put("arema",                 "arema");
        TEAM_NAME_TO_SLUG.put("arema fc",              "arema");
        TEAM_NAME_TO_SLUG.put("pss sleman",            "psssleman");
        TEAM_NAME_TO_SLUG.put("bali united",           "bali");
        TEAM_NAME_TO_SLUG.put("bali united pusam",     "bali");
        TEAM_NAME_TO_SLUG.put("psm makassar",          "psm");
        TEAM_NAME_TO_SLUG.put("psis semarang",         "psis");
        TEAM_NAME_TO_SLUG.put("psbs biak",             "psbs");
        // …extend as needed.
    }

    static String teamSlug(String teamName) {
        if (teamName == null) return null;
        String key = teamName.toLowerCase(Locale.ROOT).trim();
        String mapped = TEAM_NAME_TO_SLUG.get(key);
        if (mapped != null) return mapped;
        // Fallback: aggressive slug. Lets the frontend render the match even
        // if we haven't manually mapped this team yet.
        return key.replaceAll("[^a-z0-9]+", "");
    }

    /**
     * API-Football leagueRound looks like "Regular Season - 28". We only need the number.
     */
    private static final Pattern ROUND_NUM = Pattern.compile("(\\d+)");
    static int parseMatchday(String leagueRound) {
        if (leagueRound == null) return 0;
        Matcher mt = ROUND_NUM.matcher(leagueRound);
        return mt.find() ? Integer.parseInt(mt.group(1)) : 0;
    }

    /**
     * API-Football status short codes → frontend MatchStatus union.
     * Reference: https://www.api-football.com/documentation-v3#tag/Fixtures
     */
    static String mapStatus(String code) {
        if (code == null) return "upcoming";
        return switch (code) {
            case "1H", "2H", "HT", "ET", "BT", "P", "LIVE", "SUSP", "INT" -> "live";
            case "FT", "AET", "PEN"                                       -> "finished";
            case "PST", "CANC", "ABD", "AWD", "WO"                        -> "postponed";
            // "NS" (Not Started), "TBD", anything else → upcoming
            default                                                       -> "upcoming";
        };
    }

    // ---------- 3. API-Football wire format ----------

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ApiFootballResponse(List<FixtureItem> response) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FixtureItem(Fixture fixture, League league, Teams teams, Goals goals) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Fixture(Long id, String date, Venue venue, Status status) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Venue(String name) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Status(@JsonProperty("short") String shortCode, Integer elapsed) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record League(Integer id, String name, String round, Integer season) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Teams(Team home, Team away) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Team(Integer id, String name, String logo) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Goals(Integer home, Integer away) {}
}