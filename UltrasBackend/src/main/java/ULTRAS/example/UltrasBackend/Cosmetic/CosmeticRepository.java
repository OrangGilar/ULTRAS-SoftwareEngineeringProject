package ULTRAS.example.UltrasBackend.Cosmetic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CosmeticRepository extends JpaRepository<CosmeticItem, UUID> {
    List<CosmeticItem> findByIsActiveTrue();
    List<CosmeticItem> findByClubTagAndIsActiveTrue(String clubTag);
    List<CosmeticItem> findByTypeAndIsActiveTrue(CosmeticItem.CosmeticType type);
}

