package ULTRAS.example.UltrasBackend.Engagement;

import ULTRAS.example.UltrasBackend.User.User;
import ULTRAS.example.UltrasBackend.User.UserRepository;
import ULTRAS.example.UltrasBackend.Xp.XpRepository;
import ULTRAS.example.UltrasBackend.Xp.XpTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EngagementService {

    private final XpRepository xpRepo;
    private final PredictionRepository predictionRepo;
    private final UserRepository userRepo;

    // Central XP method — called by cosmetics (negative) and predictions/posts (positive)
    @Transactional
    public void awardXp(UUID userId, int amount, String reason) {
        XpTransaction tx = XpTransaction.builder()
                .userId(userId)
                .amount(amount)
                .reason(reason)
                .build();
        xpRepo.save(tx);

        User user = userRepo.findById(userId).orElseThrow();
        int newXp = user.getXpTotal() + amount;
        user.setXpTotal(Math.max(0, newXp));   // floor at 0
        user.setTier(calculateTier(user.getXpTotal()));
        userRepo.save(user);
    }

    private User.Tier calculateTier(int xp) {
        if (xp >= 5000) return User.Tier.LEGEND;
        if (xp >= 2000) return User.Tier.ULTRAS;
        if (xp >= 500)  return User.Tier.FAN;
        return User.Tier.ROOKIE;
    }

    @Transactional
    public Prediction submitPrediction(UUID userId, PredictionRequest req) {
        if (predictionRepo.existsByUserIdAndMatchId(userId, req.matchId()))
            throw new RuntimeException("Prediction already submitted for this match");

        Prediction p = Prediction.builder()
                .userIduserId)
                .matchId(req.matchId())
                .homeScore(req.homeScore())
                .awayScore(req.awayScore())
                .result(Prediction.Result.PENDING)
                .build();

        return predictionRepo.save(p);
    }

    // Called by admin once a match finishes
    @Transactional
    public void resolvePredictions(String matchId, int actualHome, int actualAway) {
        predictionRepo.findyByMatchId(matchId).forEach(p -> {
            boolean correct = p.getHomeScore() == actualHome
                    && p.getAwayScore() == actualAway;
            p.setResult(correct ? Prediction.Result.CORRECT : Prediction.Result.INCORRECT);
            if (correct) {
                p.setXpAwarded(XpTransaction.XP_CORRECT_PREDICTION);
                awardXp(p.getUserId(), XpTransaction.XP_CORRECT_PREDICTION, "CORRECT_PREDICTION");
            }
            predictionRepo.save(p);
        });
    }

    // View XP history for the current user
    public List<XpTransaction> getXpHistory(UUID userId) {
        return xpRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // View a user's prediction history
    public List<Prediction> getPredictionHistory(UUID userId) {
        return predictionRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}

record PredictionRequest(String matchId, int homeScore, int awayScore) {}

