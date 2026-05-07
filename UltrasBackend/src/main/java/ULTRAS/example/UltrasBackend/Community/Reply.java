package ULTRAS.example.UltrasBackend.Community;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "replies",
        indexes = {
                @Index(name = "idx_replies_thread", columnList = "thread_id, created_at"),
                @Index(name = "idx_replies_author", columnList = "author_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "thread_id", nullable = false)
    private UUID threadId;

    @Column(name = "author_id", nullable = false)
    private UUID authorId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}