package ULTRAS.example.UltrasBackend.Match;

import ULTRAS.example.UltrasBackend.Common.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class ApiFootballClient {

    private static final Logger log = LoggerFactory.getLogger(ApiFootballClient.class);

    private final RestClient client;
    private final boolean enabled;

    public ApiFootballClient(
            @Qualifier("apiFootballRestClient") RestClient client,
            @Value("${apifootball.api-key:}") String apiKey
    ) {
        this.client = client;
        this.enabled = apiKey != null && !apiKey.isBlank();
        if (!enabled) {
            log.warn("apifootball.api-key is not set — live score sync will be disabled.");
        }
    }

    public boolean isEnabled() { return enabled; }

    public MatchDtos.ApiFootballResponse fetchFixturesForSeason(int leagueId, int season) {
        if (!enabled) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                "API-Football integration is not configured (missing apifootball.api-key)");

        try {
            return client.get()
                    .uri(uri -> uri.path("/fixtures")
                            .queryParam("league", leagueId)
                            .queryParam("season", season)
                            .build())
                    .retrieve()
                    .body(MatchDtos.ApiFootballResponse.class);
        } catch (RestClientResponseException ex) {
            log.error("API-Football fixtures call failed: {} {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "API-Football error (" + ex.getStatusCode() + "). Check your key and quota.");
        } catch (Exception ex) {
            log.error("API-Football fixtures call failed", ex);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Couldn't reach API-Football: " + ex.getMessage());
        }
    }

    public MatchDtos.ApiFootballResponse fetchLive(int leagueId) {
        if (!enabled) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                "API-Football integration is not configured");

        try {
            return client.get()
                    .uri(uri -> uri.path("/fixtures")
                            .queryParam("live", "all")
                            .queryParam("league", leagueId)
                            .build())
                    .retrieve()
                    .body(MatchDtos.ApiFootballResponse.class);
        } catch (Exception ex) {
            log.error("API-Football live call failed", ex);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Couldn't reach API-Football: " + ex.getMessage());
        }
    }

    /**
     * GET /standings?league={id}&season={season}
     * Returns the season's league table. Liga 1 is a single-group league so the
     * outer list (api-football models groups as a list of lists) almost always has
     * exactly one entry — StandingService just flattens [0].
     */
    public StandingDtos.ApiStandingsResponse fetchStandings(int leagueId, int season) {
        if (!enabled) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                "API-Football integration is not configured (missing apifootball.api-key)");

        try {
            return client.get()
                    .uri(uri -> uri.path("/standings")
                            .queryParam("league", leagueId)
                            .queryParam("season", season)
                            .build())
                    .retrieve()
                    .body(StandingDtos.ApiStandingsResponse.class);
        } catch (RestClientResponseException ex) {
            log.error("API-Football standings call failed: {} {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "API-Football error (" + ex.getStatusCode() + "). Check your key and quota.");
        } catch (Exception ex) {
            log.error("API-Football standings call failed", ex);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Couldn't reach API-Football: " + ex.getMessage());
        }
    }
}