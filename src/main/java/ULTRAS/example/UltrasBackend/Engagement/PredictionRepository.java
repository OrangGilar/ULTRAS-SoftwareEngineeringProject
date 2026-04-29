package ULTRAS.example.UltrasBackend.Engagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, UUID> {
    boolean existByUserIdAndMatchId(UUID userId, String matchId);
    List<Prediction> findyByMatchId(String matchId);
    List<Prediction> findyByUserIdOrderByCreatedAtDesc(UUID userId);



}
