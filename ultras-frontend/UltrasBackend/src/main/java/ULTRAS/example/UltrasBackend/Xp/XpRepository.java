package ULTRAS.example.UltrasBackend.Xp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface XpRepository extends JpaRepository<XpTransaction, UUID> {
    List<XpTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId);
}

