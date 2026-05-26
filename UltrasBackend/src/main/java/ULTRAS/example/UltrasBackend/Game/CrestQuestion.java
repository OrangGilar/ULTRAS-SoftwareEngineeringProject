package ULTRAS.example.UltrasBackend.Game;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crest_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "club_id", nullable = false, length = 64)
    private String clubId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "crest_choices", joinColumns = @JoinColumn(name = "question_id"))
    @OrderColumn(name = "choice_order")
    @Column(name = "choice", nullable = false)
    @Builder.Default
    private List<String> choices = new ArrayList<>();

    @Column(name = "answer_index", nullable = false)
    private int answerIndex;
}
