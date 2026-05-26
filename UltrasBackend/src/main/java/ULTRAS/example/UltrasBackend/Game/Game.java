package ULTRAS.example.UltrasBackend.Game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @Column(length = 64)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(length = 8)
    private String emoji;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "reward_per_win", nullable = false)
    private int rewardPerWin;
}
