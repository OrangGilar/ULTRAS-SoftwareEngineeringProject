package ULTRAS.example.UltrasBackend.Match;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * Defines the RestClient your ApiFootballClient injects via
 *   @Qualifier("apiFootballRestClient")
 *
 * Without this bean, Spring fails to start the moment the Match module is loaded —
 * the original code referenced the qualifier without ever defining it.
 *
 * Two header schemes are supported by API-Football depending on whether you use
 * the direct api-football.com endpoint or the RapidAPI proxy. We default to the
 * direct one (api-sports.io) since it's a single header and one less dependency
 * on a third-party gateway. Override via properties if you're on RapidAPI.
 */
@Configuration
public class RestClientConfig {

    @Bean
    public RestClient apiFootballRestClient(
            @Value("${apifootball.base-url:https://v3.football.api-sports.io}") String baseUrl,
            @Value("${apifootball.api-key:}") String apiKey,
            @Value("${apifootball.host-header:v3.football.api-sports.io}") String hostHeader
    ) {
        RestClient.Builder builder = RestClient.builder().baseUrl(baseUrl);

        // Don't blow up at startup if the key is missing — ApiFootballClient already
        // checks isEnabled() and degrades gracefully to cached data.
        if (apiKey != null && !apiKey.isBlank()) {
            builder.defaultHeader("x-apisports-key", apiKey);
            // Some users route through RapidAPI; harmless on the direct endpoint.
            builder.defaultHeader("x-rapidapi-host", hostHeader);
            builder.defaultHeader("x-rapidapi-key", apiKey);
        }

        return builder.build();
    }
}
