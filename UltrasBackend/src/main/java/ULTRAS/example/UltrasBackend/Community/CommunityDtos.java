package ULTRAS.example.UltrasBackend.Community;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Wire shapes shared by the controller, service, and frontend.
 *
 * authorId was added to both ThreadResponse and ReplyResponse so the
 * frontend can compare it to the locally-cached `AuthResponse.userId` and
 * show delete buttons only to the actual author. Without this, the only
 * thing the client could compare on was authorName, which is fragile
 * (display-name collisions, no guarantee of immutability).
 */
public final class CommunityDtos {

    private CommunityDtos() {}

    // ---------- Responses ----------

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ThreadResponse(
            UUID id,
            String clubId,           // a.k.a. clubTag — this is the topic club
            String title,
            String body,
            UUID authorId,           // who created it — frontend compares to its own userId
            String authorName,
            String authorClubId,     // a.k.a. authorClubTag
            int upvotes,
            int replyCount,
            String createdAtISO,
            boolean viewerHasUpvoted
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ReplyResponse(
            UUID id,
            UUID threadId,
            UUID authorId,
            String authorName,
            String body,
            String createdAtISO
    ) {}

    /** Returned by GET /api/threads/{id} — full detail with replies. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ThreadDetailResponse(
            ThreadResponse thread,
            List<ReplyResponse> replies
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record UpvoteResponse(
            UUID threadId,
            int upvoteCount,
            boolean viewerHasUpvoted
    ) {}

    // ---------- Requests ----------

    public record CreateThreadRequest(
            @NotBlank @Size(min = 3, max = 200) String title,
            @NotBlank @Size(min = 1, max = 4000) String body,
            String clubTag,         // optional — topic club
            String authorClubTag    // optional — author's stated affiliation snapshot
    ) {}

    public record CreateReplyRequest(
            @NotBlank @Size(min = 1, max = 2000) String body
    ) {}

    /** Blank/null clubTag means move to General (no club). */
    public record MoveThreadRequest(String clubTag) {}

    /**
     * Internal mapping helper. Building responses requires knowing both the entity
     * AND whether the viewing user has upvoted, so this is a static factory rather
     * than a method on the entity.
     */
    static ThreadResponse toResponse(Thread t, String authorName, boolean viewerHasUpvoted) {
        return new ThreadResponse(
                t.getId(),
                t.getClubTag(),
                t.getTitle(),
                t.getBody(),
                t.getAuthorId(),
                authorName,
                t.getAuthorClubTag(),
                t.getUpvoteCount(),
                t.getReplyCount(),
                t.getCreatedAt() != null ? t.getCreatedAt().toString() : null,
                viewerHasUpvoted
        );
    }

    static ReplyResponse toResponse(Reply r, String authorName) {
        return new ReplyResponse(
                r.getId(),
                r.getThreadId(),
                r.getAuthorId(),
                authorName,
                r.getBody(),
                r.getCreatedAt() != null ? r.getCreatedAt().toString() : null
        );
    }

    /** Used by service when we couldn't resolve the author (e.g. user deleted). */
    static String fallbackAuthorName() { return "[deleted]"; }

    @SuppressWarnings("unused")
    private static OffsetDateTime never() { return null; } // keeps imports happy across refactors
}
