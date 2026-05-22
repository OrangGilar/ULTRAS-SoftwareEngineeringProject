package ULTRAS.example.UltrasBackend.Community;

import ULTRAS.example.UltrasBackend.Common.ApiException;
import ULTRAS.example.UltrasBackend.User.User;
import ULTRAS.example.UltrasBackend.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static ULTRAS.example.UltrasBackend.Community.CommunityDtos.*;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final ThreadRepository threadRepo;
    private final ReplyRepository replyRepo;
    private final ThreadUpvoteRepository upvoteRepo;
    private final UserRepository userRepo;

    // ---------- Reads ----------

    /**
     * List threads, optionally filtered by club tag. The viewerId may be null
     * for anonymous reads — in that case we just leave viewerHasUpvoted=false.
     */
    @Transactional(readOnly = true)
    public List<ThreadResponse> list(String clubTag, int limit, UUID viewerId) {
        Pageable page = PageRequest.of(0, Math.min(Math.max(limit, 1), 100));
        final List<Thread> threads;
        if (clubTag == null || clubTag.isBlank()) {
            threads = threadRepo.findAllByOrderByCreatedAtDesc(page);
        } else if (KnownClubs.GENERAL_TAG.equals(clubTag)) {
            threads = threadRepo.findByClubTagIsNullOrderByCreatedAtDesc(page);
        } else {
            threads = threadRepo.findByClubTagOrderByCreatedAtDesc(clubTag, page);
        }

        if (threads.isEmpty()) return List.of();

        // Bulk-fetch authors and viewer's upvotes so we don't N+1 the database.
        Map<UUID, String> authorNames = loadAuthorNames(threads.stream().map(Thread::getAuthorId).toList());
        Set<UUID> upvoted = (viewerId == null)
                ? Set.of()
                : upvoteRepo.findUpvotedThreadIds(viewerId, threads.stream().map(Thread::getId).toList());

        return threads.stream()
                .map(t -> toResponse(
                        t,
                        authorNames.getOrDefault(t.getAuthorId(), fallbackAuthorName()),
                        upvoted.contains(t.getId())
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ThreadDetailResponse get(UUID threadId, UUID viewerId) {
        Thread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Thread not found"));

        List<Reply> replies = replyRepo.findByThreadIdOrderByCreatedAtAsc(threadId);

        // One bulk query covers thread author + all reply authors.
        List<UUID> authorIds = new ArrayList<>();
        authorIds.add(thread.getAuthorId());
        replies.forEach(r -> authorIds.add(r.getAuthorId()));
        Map<UUID, String> authorNames = loadAuthorNames(authorIds);

        boolean viewerHasUpvoted = viewerId != null
                && upvoteRepo.findByThreadIdAndUserId(threadId, viewerId).isPresent();

        ThreadResponse threadResp = toResponse(
                thread,
                authorNames.getOrDefault(thread.getAuthorId(), fallbackAuthorName()),
                viewerHasUpvoted
        );

        List<ReplyResponse> replyResps = replies.stream()
                .map(r -> toResponse(r, authorNames.getOrDefault(r.getAuthorId(), fallbackAuthorName())))
                .toList();

        return new ThreadDetailResponse(threadResp, replyResps);
    }

    // ---------- Writes ----------

    @Transactional
    public ThreadResponse create(UUID authorId, CreateThreadRequest req) {
        User author = userRepo.findById(authorId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unknown user"));

        // Clamp clubTag to the canonical Liga 1 list. Anything else (including the
        // GENERAL_TAG sentinel, which is a query-only value) gets dropped to null
        // so users can't invent fake communities by hand-crafting the payload.
        String clubTag = blankToNull(req.clubTag());
        if (clubTag != null && !KnownClubs.isValid(clubTag)) {
            clubTag = null;
        }
        String authorClubTag = blankToNull(req.authorClubTag());
        if (authorClubTag != null && !KnownClubs.isValid(authorClubTag)) {
            authorClubTag = null;
        }

        Thread thread = Thread.builder()
                .title(req.title().trim())
                .body(req.body().trim())
                .clubTag(clubTag)
                .authorId(authorId)
                .authorClubTag(authorClubTag)
                .upvoteCount(0)
                .replyCount(0)
                .createdAt(OffsetDateTime.now())
                .build();

        thread = threadRepo.save(thread);
        return toResponse(thread, author.getUsername(), false);
    }

    @Transactional
    public ThreadResponse move(UUID threadId, UUID viewerId, MoveThreadRequest req) {
        Thread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Thread not found"));
        if (!thread.getAuthorId().equals(viewerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the author can move this thread");
        }
        String clubTag = blankToNull(req.clubTag());
        if (clubTag != null && !KnownClubs.isValid(clubTag)) {
            clubTag = null;
        }
        thread.setClubTag(clubTag);
        threadRepo.save(thread);
        User author = userRepo.findById(viewerId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unknown user"));
        boolean viewerHasUpvoted = upvoteRepo.findByThreadIdAndUserId(threadId, viewerId).isPresent();
        return toResponse(thread, author.getUsername(), viewerHasUpvoted);
    }

    @Transactional
    public void delete(UUID threadId, UUID viewerId) {
        Thread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Thread not found"));
        if (!thread.getAuthorId().equals(viewerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the author can delete this thread");
        }
        // Manual cascade — explicit is better than relying on @OneToMany cascade,
        // which can surprise you when batching.
        replyRepo.deleteByThreadId(threadId);
        upvoteRepo.deleteByThreadId(threadId);
        threadRepo.delete(thread);
    }

    // ---------- Upvotes ----------

    /**
     * Toggle upvote. If the user has already upvoted, unvote and decrement.
     * Otherwise, insert and increment. Returns the new state for the UI.
     *
     * The unique constraint on (thread_id, user_id) makes the insert path
     * idempotent — even if two requests race, at most one row gets in.
     */
    @Transactional
    public UpvoteResponse toggleUpvote(UUID threadId, UUID userId) {
        Thread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Thread not found"));

        Optional<ThreadUpvote> existing = upvoteRepo.findByThreadIdAndUserId(threadId, userId);

        if (existing.isPresent()) {
            upvoteRepo.delete(existing.get());
            threadRepo.decrementUpvotes(threadId);
            return new UpvoteResponse(threadId, Math.max(0, thread.getUpvoteCount() - 1), false);
        } else {
            ThreadUpvote vote = ThreadUpvote.builder()
                    .threadId(threadId)
                    .userId(userId)
                    .createdAt(OffsetDateTime.now())
                    .build();
            upvoteRepo.save(vote);
            threadRepo.incrementUpvotes(threadId);
            return new UpvoteResponse(threadId, thread.getUpvoteCount() + 1, true);
        }
    }

    // ---------- Replies ----------

    @Transactional
    public ReplyResponse reply(UUID threadId, UUID authorId, CreateReplyRequest req) {
        // Verify thread exists before the insert — gives a clean 404 instead of an
        // ugly FK violation if someone replies to a deleted thread.
        if (!threadRepo.existsById(threadId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Thread not found");
        }
        User author = userRepo.findById(authorId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unknown user"));

        Reply reply = Reply.builder()
                .threadId(threadId)
                .authorId(authorId)
                .body(req.body().trim())
                .createdAt(OffsetDateTime.now())
                .build();
        reply = replyRepo.save(reply);
        threadRepo.incrementReplies(threadId);

        return toResponse(reply, author.getUsername());
    }

    @Transactional
    public void deleteReply(UUID threadId, UUID replyId, UUID viewerId) {
        Reply reply = replyRepo.findById(replyId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Reply not found"));

        if (!reply.getThreadId().equals(threadId)) {
            // The URL claims this reply belongs to a different thread. 404 to
            // avoid leaking that the reply exists somewhere else.
            throw new ApiException(HttpStatus.NOT_FOUND, "Reply not found");
        }
        if (!reply.getAuthorId().equals(viewerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the author can delete this reply");
        }
        replyRepo.delete(reply);
        threadRepo.decrementReplies(threadId);
    }

    // ---------- Helpers ----------

    private Map<UUID, String> loadAuthorNames(List<UUID> ids) {
        if (ids.isEmpty()) return Map.of();
        return userRepo.findAllById(new HashSet<>(ids)).stream()
                .collect(Collectors.toMap(User::getId, User::getUsername));
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}