package ULTRAS.example.UltrasBackend.Community;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static ULTRAS.example.UltrasBackend.Community.CommunityDtos.*;

/**
 * Community endpoints. Read endpoints are public so anonymous visitors can
 * still see what's being discussed (mirrors the matches module's policy).
 * All writes require auth.
 *
 * The viewer's UUID — needed for "have I upvoted this?" — is read straight off
 * the request attribute set by JwtAuthenticationFilter. We use a helper to make
 * it nullable (anonymous reads) instead of failing.
 */
@RestController
@RequestMapping("/api/threads")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService service;

    // ---------- Reads (public) ----------

    @GetMapping
    public ResponseEntity<List<ThreadResponse>> list(
            @RequestParam(required = false) String clubTag,
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest request) {
        return ResponseEntity.ok(service.list(clubTag, limit, optionalUserId(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreadDetailResponse> get(
            @PathVariable UUID id,
            HttpServletRequest request) {
        return ResponseEntity.ok(service.get(id, optionalUserId(request)));
    }

    // ---------- Writes (auth required) ----------

    @PostMapping
    public ResponseEntity<ThreadResponse> create(
            @Valid @RequestBody CreateThreadRequest req,
            @RequestAttribute UUID userId) {
        return ResponseEntity.ok(service.create(userId, req));
    }

    @PatchMapping("/{id}/move")
    public ResponseEntity<ThreadResponse> move(
            @PathVariable UUID id,
            @RequestBody MoveThreadRequest req,
            @RequestAttribute UUID userId) {
        return ResponseEntity.ok(service.move(id, userId, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestAttribute UUID userId) {
        service.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<UpvoteResponse> upvote(
            @PathVariable UUID id,
            @RequestAttribute UUID userId) {
        return ResponseEntity.ok(service.toggleUpvote(id, userId));
    }

    @PostMapping("/{id}/replies")
    public ResponseEntity<ReplyResponse> reply(
            @PathVariable UUID id,
            @Valid @RequestBody CreateReplyRequest req,
            @RequestAttribute UUID userId) {
        return ResponseEntity.ok(service.reply(id, userId, req));
    }

    @DeleteMapping("/{threadId}/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(
            @PathVariable UUID threadId,
            @PathVariable UUID replyId,
            @RequestAttribute UUID userId) {
        service.deleteReply(threadId, replyId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Reads the userId attribute that JwtAuthenticationFilter sets on
     * authenticated requests. Returns null for anonymous traffic instead of
     * throwing — read endpoints accept both.
     */
    private static UUID optionalUserId(HttpServletRequest request) {
        Object attr = request.getAttribute("userId");
        return (attr instanceof UUID u) ? u : null;
    }
}