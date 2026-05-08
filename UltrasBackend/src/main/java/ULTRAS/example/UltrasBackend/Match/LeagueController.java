package ULTRAS.example.UltrasBackend.Match;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import ULTRAS.example.UltrasBackend.Common.ApiException;

/*
 *   GET /api/teams/{slug}/matches      — every Liga 1 match for that team, sorted asc.
 *                                        The frontend tabs split it into Recent vs
 *                                        Upcoming; both states come from one fetch.
 *   GET /api/teams/{slug}/standing     — the team's row in the league table.
 *   GET /api/standings                 — full Liga 1 table.
 *   POST /api/standings/sync           — force-refresh standings cache (auth required
 *                                        per SecurityConfig — POSTs aren't permitAll).
 */
@RestController
@RequiredArgsConstructor
public class LeagueController {

    private final LiveScoreService liveScoreService;
    private final StandingService standingService;

    @GetMapping("/api/teams/{slug}/matches")
    public ResponseEntity<List<MatchDtos.FrontendMatch>> teamMatches(@PathVariable String slug) {
        return ResponseEntity.ok(liveScoreService.getMatchesForTeamSlug(slug));
    }

    @GetMapping("/api/teams/{slug}/standing")
    public ResponseEntity<StandingDtos.FrontendStanding> teamStanding(@PathVariable String slug) {
        StandingDtos.FrontendStanding row = standingService.findBySlug(slug);
        if (row == null) {
            // 404 here rather than null body so the frontend's error branch can
            // distinguish "team not in table" from "couldn't reach upstream".
            throw new ApiException(HttpStatus.NOT_FOUND,
                    "Team '" + slug + "' is not in the current standings");
        }
        return ResponseEntity.ok(row);
    }

    @GetMapping("/api/standings")
    public ResponseEntity<List<StandingDtos.FrontendStanding>> standings() {
        return ResponseEntity.ok(standingService.getLiga1Standings());
    }

    @PostMapping("/api/standings/sync")
    public ResponseEntity<Map<String, Object>> syncStandings() {
        int count = standingService.forceSync();
        return ResponseEntity.ok(Map.of("synced", count));
    }
}
