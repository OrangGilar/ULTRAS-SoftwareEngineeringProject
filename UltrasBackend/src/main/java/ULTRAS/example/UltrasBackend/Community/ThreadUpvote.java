package ULTRAS.example.UltrasBackend.Community;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;


@Entity
@Table(
        name = "thread_upvotes",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_thread_upvote_one_per_user",
                columnNames = {"thread_id", "user_id"}
        ),
        indexes = {
                @Index(name = "idx_thread_upvotes_user", columnList = "user_id"),
                @Index(name = "idx_thread_upvotes_thread", columnList = "thread_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreadUpvote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "thread_id", nullable = false)
    private UUID threadId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
