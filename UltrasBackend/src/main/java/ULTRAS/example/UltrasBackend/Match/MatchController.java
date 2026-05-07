package ULTRAS.example.UltrasBackend.Match;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Default endpoints return the frontend-aligned shape (FrontendMatch) so the
 * Next.js app can drop them straight into its `Match` type with no extra mapping.
 *
 * The original raw shape is still available under /raw for admin/debug tooling
 * and for anyone who wants the API-Football status codes verbatim.
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final LiveScoreService liveScoreService;

    /** All cached Liga 1 fixtures, frontend-shaped. Public — no auth required. */
    @GetMapping
    public ResponseEntity<List<MatchDtos.FrontendMatch>> list() {
        return ResponseEntity.ok(liveScoreService.getLiga1FixturesForFrontend());
    }

    /** Only currently-live Liga 1 matches, frontend-shaped. Public. */
    @GetMapping("/live")
    public ResponseEntity<List<MatchDtos.FrontendMatch>> live() {
        return ResponseEntity.ok(liveScoreService.getLiveLiga1ForFrontend());
    }

    /**
     * Single fixture by frontend ID (which is the API fixture ID as a string).
     * We match on the upstream ID rather than the internal UUID so the URL is
     * stable across DB resets and lines up with what the list endpoint returns.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MatchDtos.FrontendMatch> get(@PathVariable String id) {
        return ResponseEntity.ok(liveScoreService.getByFrontendIdForFrontend(id));
    }

    // ---------- Raw (backend-shaped) variants for admin/debug ----------

    @GetMapping("/raw")
    public ResponseEntity<List<MatchDtos.MatchResponse>> listRaw() {
        return ResponseEntity.ok(liveScoreService.getLiga1Fixtures());
    }

    @GetMapping("/raw/{id}")
    public ResponseEntity<MatchDtos.MatchResponse> getRaw(@PathVariable UUID id) {
        return ResponseEntity.ok(liveScoreService.getById(id));
    }

    /**
     * Force a sync regardless of TTL. Auth-required (any user) so we don't burn
     * the daily API quota on anonymous traffic. Wire @PreAuthorize("hasRole('ADMIN')")
     * once role claims are in JWT.
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> sync() {
        int count = liveScoreService.forceSync();
        return ResponseEntity.ok(Map.of("synced", count));
    }
}
