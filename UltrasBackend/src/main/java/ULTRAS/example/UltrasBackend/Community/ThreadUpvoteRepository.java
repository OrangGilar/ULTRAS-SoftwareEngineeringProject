package ULTRAS.example.UltrasBackend.Community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ThreadUpvoteRepository extends JpaRepository<ThreadUpvote, UUID> {
    Optional<ThreadUpvote> findByThreadIdAndUserId(UUID threadId, UUID userId);

    @Query("SELECT u.threadId FROM ThreadUpvote u WHERE u.userId = :userId AND u.threadId IN :threadIds")
    Set<UUID> findUpvotedThreadIds(@Param("userId") UUID userId, @Param("threadIds") List<UUID> threadIds);

    void deleteByThreadId(UUID threadId);
}
