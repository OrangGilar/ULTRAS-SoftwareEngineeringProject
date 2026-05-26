package ULTRAS.example.UltrasBackend.Game;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ULTRAS.example.UltrasBackend.Common.ApiException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final TriviaQuestionRepository triviaRepository;
    private final CrestQuestionRepository crestRepository;

    public List<GameDtos.FrontendGame> getAll() {
        return gameRepository.findAll().stream()
                .map(GameDtos.FrontendGame::from)
                .toList();
    }

    public GameDtos.FrontendGame getBySlug(String slug) {
        return gameRepository.findById(slug)
                .map(GameDtos.FrontendGame::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Game not found: " + slug));
    }

    public List<GameDtos.FrontendTriviaQuestion> getTriviaQuestions() {
        return triviaRepository.findAll().stream()
                .map(GameDtos.FrontendTriviaQuestion::from)
                .toList();
    }

    public List<GameDtos.FrontendCrestQuestion> getCrestQuestions() {
        return crestRepository.findAll().stream()
                .map(GameDtos.FrontendCrestQuestion::from)
                .toList();
    }
}
