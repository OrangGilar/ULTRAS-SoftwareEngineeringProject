package ULTRAS.example.UltrasBackend.Community;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, UUID> {
    List<Thread> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Thread> findByClubTagOrderByCreatedAtDesc(String clubTag, Pageable pageable);
    List<Thread> findByClubTagIsNullOrderByCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("UPDATE Thread t SET t.upvoteCount = t.upvoteCount + 1 WHERE t.id = :id")
    int incrementUpvotes(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Thread t SET t.upvoteCount = t.upvoteCount - 1 WHERE t.id = :id AND t.upvoteCount > 0")
    int decrementUpvotes(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Thread t SET t.replyCount = t.replyCount + 1 WHERE t.id = :id")
    int incrementReplies(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Thread t SET t.replyCount = t.replyCount - 1 WHERE t.id = :id AND t.replyCount > 0")
    int decrementReplies(@Param("id") UUID id);
}
