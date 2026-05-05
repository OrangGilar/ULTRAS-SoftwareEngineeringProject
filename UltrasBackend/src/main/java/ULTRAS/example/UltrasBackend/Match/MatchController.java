package ULTRAS.example.UltrasBackend.Match;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final LiveScoreService liveScoreService;

    /** All cached Liga 1 fixtures. Public — no auth required. */
    @GetMapping
    public ResponseEntity<List<MatchDtos.MatchResponse>> list() {
        return ResponseEntity.ok(liveScoreService.getLiga1Fixtures());
    }

    /** Only currently-live Liga 1 matches. Public. */
    @GetMapping("/live")
    public ResponseEntity<List<MatchDtos.MatchResponse>> live() {
        return ResponseEntity.ok(liveScoreService.getLiveLiga1());
    }

    /** Single fixture detail. Public. */
    @GetMapping("/{id}")
    public ResponseEntity<MatchDtos.MatchResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(liveScoreService.getById(id));
    }

    /**
     * Force a sync regardless of TTL. Auth-required (any user) so we don't burn the
     * daily API quota on anonymous traffic. Wire @PreAuthorize("hasRole('ADMIN')")
     * once role claims are in JWT.
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> sync() {
        int count = liveScoreService.forceSync();
        return ResponseEntity.ok(Map.of("synced", count));
    }
}
