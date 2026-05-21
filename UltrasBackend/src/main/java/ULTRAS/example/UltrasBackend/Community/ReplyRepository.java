package ULTRAS.example.UltrasBackend.Community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, UUID> {
    List<Reply> findByThreadIdOrderByCreatedAtAsc(UUID threadId);
    long countByThreadId(UUID threadId);
    void deleteByThreadId(UUID threadId);
}
