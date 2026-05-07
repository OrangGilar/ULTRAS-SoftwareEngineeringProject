package ULTRAS.example.UltrasBackend.Community;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;


public final class CommunityRepositories {

    private CommunityRepositories() {}

    @Repository
    public interface ThreadRepository extends JpaRepository<Thread, UUID> {

        /** Latest threads first. Pageable lets the controller cap the response size. */
        List<Thread> findAllByOrderByCreatedAtDesc(Pageable pageable);

        /** Threads tagged with a specific club, latest first. */
        List<Thread> findByClubTagOrderByCreatedAtDesc(String clubTag, Pageable pageable);

        /**
         * Atomic counter bumps. Doing UPDATE … SET col = col +/- 1 in a single
         * statement avoids the read-modify-write race that would happen if we
         * loaded the entity, mutated, and saved.
         */
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

    @Repository
    public interface ReplyRepository extends JpaRepository<Reply, UUID> {
        List<Reply> findByThreadIdOrderByCreatedAtAsc(UUID threadId);
        long countByThreadId(UUID threadId);
        void deleteByThreadId(UUID threadId);
    }

    @Repository
    public interface ThreadUpvoteRepository extends JpaRepository<ThreadUpvote, UUID> {

        Optional<ThreadUpvote> findByThreadIdAndUserId(UUID threadId, UUID userId);

        /**
         * Bulk lookup for "which of these threads has the current user upvoted?"
         * Used by list endpoints so the UI can show pre-pressed upvote buttons.
         */
        @Query("SELECT u.threadId FROM ThreadUpvote u WHERE u.userId = :userId AND u.threadId IN :threadIds")
        Set<UUID> findUpvotedThreadIds(@Param("userId") UUID userId, @Param("threadIds") List<UUID> threadIds);

        void deleteByThreadId(UUID threadId);
    }
}