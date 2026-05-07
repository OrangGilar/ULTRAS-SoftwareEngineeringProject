package ULTRAS.example.UltrasBackend.Community;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "threads",
        indexes = {
                @Index(name = "idx_threads_created", columnList = "created_at"),
                @Index(name = "idx_threads_club_tag", columnList = "club_tag"),
                @Index(name = "idx_threads_author", columnList = "author_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Thread {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    /** Postgres TEXT — no length limit. Fine for reasonable post bodies. */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    /**
     * Topic tag (which club the thread is *about*). Nullable — threads about Liga 1
     * generally, or off-topic, leave this null.
     */
    @Column(name = "club_tag", length = 50)
    private String clubTag;

    @Column(name = "author_id", nullable = false)
    private UUID authorId;

    /**
     * Snapshot of the author's stated club affiliation at the time of posting.
     * Captured at write time so a user changing affiliation later doesn't rewrite
     * the history of their old posts.
     */
    @Column(name = "author_club_tag", length = 50)
    private String authorClubTag;

    /** Denormalized counters — kept in sync transactionally by CommunityService. */
    @Column(name = "upvote_count", nullable = false)
    @Builder.Default
    private int upvoteCount = 0;

    @Column(name = "reply_count", nullable = false)
    @Builder.Default
    private int replyCount = 0;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
