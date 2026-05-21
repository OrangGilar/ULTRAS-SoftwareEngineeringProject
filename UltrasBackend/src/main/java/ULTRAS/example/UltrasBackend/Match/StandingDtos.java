package ULTRAS.example.UltrasBackend.Match;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

public final class StandingDtos {

    private StandingDtos() {}

    // ---------- 1. Frontend-aligned shape ----------

    /** Mirrors `TeamStanding` in app/types/index.ts. Slug is computed via MatchDtos.teamSlug. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record FrontendStanding(
            int rank,
            String teamId,        // slug (e.g. "persija") so frontend can /teams/{teamId}
            String teamName,      // display name
            String teamLogo,      // crest URL
            int played,
            int win,
            int draw,
            int lose,
            int goalsFor,
            int goalsAgainst,
            int goalsDiff,
            int points,
            String form           // e.g. "WDLWW", may be null
    ) {
        public static FrontendStanding from(StandingItem item) {
            String name = item.team() != null ? item.team().name() : null;
            return new FrontendStanding(
                    nz(item.rank()),
                    MatchDtos.teamSlug(name),
                    name,
                    item.team() != null ? item.team().logo() : null,
                    item.all() != null ? nz(item.all().played()) : 0,
                    item.all() != null ? nz(item.all().win())    : 0,
                    item.all() != null ? nz(item.all().draw())   : 0,
                    item.all() != null ? nz(item.all().lose())   : 0,
                    item.all() != null && item.all().goals() != null ? nz(item.all().goals().forGoals()) : 0,
                    item.all() != null && item.all().goals() != null ? nz(item.all().goals().against())  : 0,
                    nz(item.goalsDiff()),
                    nz(item.points()),
                    item.form()
            );
        }

        private static int nz(Integer v) { return v == null ? 0 : v; }
    }

    // ---------- 2. API-Football wire format ----------

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ApiStandingsResponse(List<StandingsLeagueWrap> response) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingsLeagueWrap(StandingsLeague league) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingsLeague(
            Integer id, String name, String country, String logo,
            Integer season, List<List<StandingItem>> standings
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingItem(
            Integer rank,
            MatchDtos.Team team,
            Integer points,
            Integer goalsDiff,
            String group,
            String form,
            StandingStats all,
            StandingStats home,
            StandingStats away
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingStats(Integer played, Integer win, Integer draw, Integer lose, StandingGoals goals) {}

    /**
     * "for" is a reserved word in Java, so the field is named forGoals here. Jackson
     * picks it up because of the @JsonProperty alias.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingGoals(
            @com.fasterxml.jackson.annotation.JsonProperty("for") Integer forGoals,
            Integer against
    ) {}
}
