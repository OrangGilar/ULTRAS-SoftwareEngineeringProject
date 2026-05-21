package ULTRAS.example.UltrasBackend.Engagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, UUID> {
    boolean existsByUserIdAndMatchId(UUID userId, String matchId);
    List<Prediction> findByMatchId(String matchId);
    List<Prediction> findByUserIdOrderByCreatedAtDesc(UUID userId);
}