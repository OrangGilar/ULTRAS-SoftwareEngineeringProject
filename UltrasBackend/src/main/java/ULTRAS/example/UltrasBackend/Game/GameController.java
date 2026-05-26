package ULTRAS.example.UltrasBackend.Game;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameDtos.FrontendGame>> list() {
        return ResponseEntity.ok(gameService.getAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<GameDtos.FrontendGame> get(@PathVariable String slug) {
        return ResponseEntity.ok(gameService.getBySlug(slug));
    }

    @GetMapping("/trivia/questions")
    public ResponseEntity<List<GameDtos.FrontendTriviaQuestion>> triviaQuestions() {
        return ResponseEntity.ok(gameService.getTriviaQuestions());
    }

    @GetMapping("/crest/questions")
    public ResponseEntity<List<GameDtos.FrontendCrestQuestion>> crestQuestions() {
        return ResponseEntity.ok(gameService.getCrestQuestions());
    }
}
