package ULTRAS.example.UltrasBackend.Club;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public reads of the Liga 1 club catalog. Returned shape matches the
 * frontend's {@code Club} type so the Next.js app can drop the payload
 * straight into its existing types.
 */
@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubDtos.FrontendClub>> list() {
        return ResponseEntity.ok(clubService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubDtos.FrontendClub> get(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getById(id));
    }
}
