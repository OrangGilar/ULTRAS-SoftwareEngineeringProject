package ULTRAS.example.UltrasBackend.Game;

import java.util.List;

public final class GameDtos {

    private GameDtos() {}

    public record FrontendGame(
            String slug,
            String name,
            String emoji,
            String description,
            int rewardPerWin
    ) {
        public static FrontendGame from(Game g) {
            return new FrontendGame(
                    g.getSlug(),
                    g.getName(),
                    g.getEmoji() == null ? "" : g.getEmoji(),
                    g.getDescription(),
                    g.getRewardPerWin()
            );
        }
    }

    public record FrontendTriviaQuestion(
            String prompt,
            List<String> choices,
            int answerIndex
    ) {
        public static FrontendTriviaQuestion from(TriviaQuestion q) {
            return new FrontendTriviaQuestion(q.getPrompt(), q.getChoices(), q.getAnswerIndex());
        }
    }

    public record FrontendCrestQuestion(
            String clubId,
            List<String> choices,
            int answerIndex
    ) {
        public static FrontendCrestQuestion from(CrestQuestion q) {
            return new FrontendCrestQuestion(q.getClubId(), q.getChoices(), q.getAnswerIndex());
        }
    }
}
