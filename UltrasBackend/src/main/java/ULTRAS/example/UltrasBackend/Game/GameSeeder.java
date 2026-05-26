package ULTRAS.example.UltrasBackend.Game;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GameSeeder implements CommandLineRunner {

    private final GameRepository gameRepo;
    private final TriviaQuestionRepository triviaRepo;
    private final CrestQuestionRepository crestRepo;

    @Override
    public void run(String... args) {
        seedGames();
        seedTriviaQuestions();
        seedCrestQuestions();
    }

    private void seedGames() {
        if (gameRepo.count() > 0) {
            log.info("Games table already populated. Skipping seed.");
            return;
        }
        gameRepo.saveAll(List.of(
                Game.builder().slug("guess-the-crest").name("Guess the Crest")
                        .emoji("").description("A blurred Liga 1 crest. You have 10 seconds.")
                        .rewardPerWin(25).build(),
                Game.builder().slug("liga-1-trivia").name("Liga 1 Trivia")
                        .emoji("").description("Five questions on Indonesian football history.")
                        .rewardPerWin(40).build(),
                Game.builder().slug("squad-memory").name("Squad Memory")
                        .emoji("").description("Match the players to their clubs before the timer hits zero.")
                        .rewardPerWin(30).build()
        ));
        log.info("Seeded 3 games.");
    }

    private void seedTriviaQuestions() {
        if (triviaRepo.count() > 0) {
            log.info("Trivia questions already populated. Skipping seed.");
            return;
        }
        triviaRepo.saveAll(List.of(
                TriviaQuestion.builder()
                        .prompt("Which Liga 1 club is nicknamed 'Maung Bandung'?")
                        .choices(List.of("Persib Bandung", "PSIS Semarang", "Arema FC", "PSM Makassar"))
                        .answerIndex(0).build(),
                TriviaQuestion.builder()
                        .prompt("PSM Makassar's traditional home colour?")
                        .choices(List.of("Blue", "Red", "Green", "White"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("Stadion Kanjuruhan is the home of which side?")
                        .choices(List.of("Persija", "Bali United", "Arema FC", "PSS Sleman"))
                        .answerIndex(2).build(),
                TriviaQuestion.builder()
                        .prompt("Which club is based in Gianyar, Bali?")
                        .choices(List.of("PSBS Biak", "Bali United", "PSIS Semarang", "Persija"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("Which club's supporters are known as 'Bobotoh'?")
                        .choices(List.of("Persija", "Persib", "PSM", "Arema"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("Persija Jakarta play their home matches at which stadium?")
                        .choices(List.of("Stadion Gelora Bung Karno", "Stadion Si Jalak Harupat", "Stadion Kanjuruhan", "Stadion Kapten I Wayan Dipta"))
                        .answerIndex(0).build(),
                TriviaQuestion.builder()
                        .prompt("Which Liga 1 club goes by the nickname 'Bajul Ijo'?")
                        .choices(List.of("Arema FC", "Persebaya Surabaya", "PSS Sleman", "Bali United"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("In which year was Persib Bandung founded?")
                        .choices(List.of("1928", "1933", "1927", "1915"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("Which club's ultras group is called 'Jakmania'?")
                        .choices(List.of("Persija Jakarta", "Arema FC", "Persebaya Surabaya", "PSM Makassar"))
                        .answerIndex(0).build(),
                TriviaQuestion.builder()
                        .prompt("PSS Sleman's nickname is?")
                        .choices(List.of("Laskar Mataram", "Super Elja", "Singo Edan", "Macan Kemayoran"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("Which club was founded first?")
                        .choices(List.of("Persib Bandung", "Persija Jakarta", "PSM Makassar", "Persebaya Surabaya"))
                        .answerIndex(2).build(),
                TriviaQuestion.builder()
                        .prompt("Arema FC is based in which city?")
                        .choices(List.of("Surabaya", "Bandung", "Malang", "Semarang"))
                        .answerIndex(2).build(),
                TriviaQuestion.builder()
                        .prompt("Which Liga 1 club is nicknamed 'Singo Edan' (Crazy Lion)?")
                        .choices(List.of("PSM Makassar", "Bali United", "Arema FC", "Borneo FC"))
                        .answerIndex(2).build(),
                TriviaQuestion.builder()
                        .prompt("Borneo FC represents which city?")
                        .choices(List.of("Pontianak", "Balikpapan", "Banjarmasin", "Samarinda"))
                        .answerIndex(3).build(),
                TriviaQuestion.builder()
                        .prompt("Which club's motto is 'Laskar Sambernyawa'?")
                        .choices(List.of("Persis Solo", "PSIM Yogyakarta", "Persik Kediri", "Madura United"))
                        .answerIndex(0).build(),
                TriviaQuestion.builder()
                        .prompt("PSIS Semarang's nickname is?")
                        .choices(List.of("Laskar Cisadane", "Mahesa Jenar", "Kabau Sirah", "Badai Pasifik"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("Which club is nicknamed 'Kabau Sirah'?")
                        .choices(List.of("Malut United", "PSBS Biak", "Semen Padang", "Bhayangkara Presisi"))
                        .answerIndex(2).build(),
                TriviaQuestion.builder()
                        .prompt("Madura United is based in which city?")
                        .choices(List.of("Surabaya", "Gresik", "Pamekasan", "Bangkalan"))
                        .answerIndex(2).build(),
                TriviaQuestion.builder()
                        .prompt("Which Liga 1 club has 'Pesut Etam' as its motto?")
                        .choices(List.of("Malut United", "Borneo FC", "PSBS Biak", "Dewa United"))
                        .answerIndex(1).build(),
                TriviaQuestion.builder()
                        .prompt("PSBS Biak represents which Indonesian province?")
                        .choices(List.of("Maluku", "Kalimantan Timur", "Papua", "Sulawesi Utara"))
                        .answerIndex(2).build()
        ));
        log.info("Seeded 20 trivia questions.");
    }

    private void seedCrestQuestions() {
        if (crestRepo.count() > 0) {
            log.info("Crest questions already populated. Skipping seed.");
            return;
        }
        crestRepo.saveAll(List.of(
                CrestQuestion.builder().clubId("persija")
                        .choices(List.of("Persib Bandung", "Persija Jakarta", "PSM Makassar", "Arema FC"))
                        .answerIndex(1).build(),
                CrestQuestion.builder().clubId("persib")
                        .choices(List.of("Persebaya Surabaya", "Persib Bandung", "PSIS Semarang", "Persija"))
                        .answerIndex(1).build(),
                CrestQuestion.builder().clubId("arema")
                        .choices(List.of("Bali United", "PSS Sleman", "Arema FC", "Persija"))
                        .answerIndex(2).build(),
                CrestQuestion.builder().clubId("psm")
                        .choices(List.of("PSM Makassar", "PSBS Biak", "Persib", "PSIS Semarang"))
                        .answerIndex(0).build(),
                CrestQuestion.builder().clubId("bali")
                        .choices(List.of("Bali United", "Persib", "PSS Sleman", "Arema FC"))
                        .answerIndex(0).build(),
                CrestQuestion.builder().clubId("persebaya")
                        .choices(List.of("Arema FC", "Persija", "Madura United", "Persebaya Surabaya"))
                        .answerIndex(3).build(),
                CrestQuestion.builder().clubId("borneo")
                        .choices(List.of("Borneo FC", "Malut United", "Dewa United", "Bhayangkara Presisi"))
                        .answerIndex(0).build(),
                CrestQuestion.builder().clubId("persis")
                        .choices(List.of("Persik Kediri", "Persis Solo", "PSIM Yogyakarta", "Persita"))
                        .answerIndex(1).build(),
                CrestQuestion.builder().clubId("psssleman")
                        .choices(List.of("PSS Sleman", "PSIS Semarang", "PSIM Yogyakarta", "Persijap"))
                        .answerIndex(0).build(),
                CrestQuestion.builder().clubId("madura")
                        .choices(List.of("Persita Tangerang", "Madura United", "Dewa United", "Borneo FC"))
                        .answerIndex(1).build(),
                CrestQuestion.builder().clubId("semenpadang")
                        .choices(List.of("Malut United", "PSBS Biak", "Semen Padang", "PSM Makassar"))
                        .answerIndex(2).build(),
                CrestQuestion.builder().clubId("psbs")
                        .choices(List.of("Borneo FC", "Malut United", "Bhayangkara Presisi", "PSBS Biak"))
                        .answerIndex(3).build()
        ));
        log.info("Seeded 12 crest questions.");
    }
}
