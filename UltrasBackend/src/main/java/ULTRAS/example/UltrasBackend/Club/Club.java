package ULTRAS.example.UltrasBackend.Club;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clubs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    // Slug used by the frontend ("persija", "persib"…). Stays stable across
    // DB resets and matches the IDs already baked into match data, community
    // routes, and KnownClubs.IDS.
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "short_name", nullable = false, length = 8)
    private String shortName;

    @Column(nullable = false)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Region region;

    @Column(nullable = false)
    private int founded;

    @Column(name = "color_primary", nullable = false, length = 9)
    private String colorPrimary;

    @Column(name = "color_secondary", nullable = false, length = 9)
    private String colorSecondary;

    @Column(name = "crest_emoji", length = 16)
    private String crestEmoji;

    private String logo;

    @Column(nullable = false)
    private String motto;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "club_vibes", joinColumns = @JoinColumn(name = "club_id"))
    @Column(name = "vibe", length = 16, nullable = false)
    @Builder.Default
    private List<String> vibe = new ArrayList<>();

    public enum Region { Java, Sumatra, Sulawesi, Bali, Kalimantan, Other }
}
