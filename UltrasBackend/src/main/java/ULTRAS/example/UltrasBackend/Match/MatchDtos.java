package ULTRAS.example.UltrasBackend.Match;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public final class MatchDtos {

    private MatchDtos() {}

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