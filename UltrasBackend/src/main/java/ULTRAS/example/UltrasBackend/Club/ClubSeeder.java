package ULTRAS.example.UltrasBackend.Club;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the clubs table on first boot. Idempotent — if any rows exist we
 * leave them alone, so editing a club through the DB or a future admin
 * endpoint isn't blown away on restart. Mirrors the legacy mock list in
 * the frontend's lib/mock/clubs.ts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ClubSeeder implements CommandLineRunner {

    private final ClubRepository clubRepo;

    @Override
    public void run(String... args) {
        if (clubRepo.count() > 0) {
            log.info("Clubs table already populated ({} rows). Skipping seed.", clubRepo.count());
            return;
        }
        List<Club> seed = List.of(
                Club.builder().id("persija").name("Persija Jakarta").shortName("PSJ")
                        .city("Jakarta").region(Club.Region.Java).founded(1928)
                        .colorPrimary("#e11d2e").colorSecondary("#f8a4ac")
                        .crestEmoji("").logo("/logo/Persija Jakarta.png")
                        .vibe(List.of("attacking", "ultras", "veteran"))
                        .motto("Macan Kemayoran").build(),
                Club.builder().id("persib").name("Persib Bandung").shortName("PSB")
                        .city("Bandung").region(Club.Region.Java).founded(1933)
                        .colorPrimary("#1d4ed8").colorSecondary("#93c5fd")
                        .crestEmoji("").logo("/logo/Persib Bandung.png")
                        .vibe(List.of("pragmatic", "ultras", "veteran"))
                        .motto("Maung Bandung").build(),
                Club.builder().id("persebaya").name("Persebaya Surabaya").shortName("PBY")
                        .city("Surabaya").region(Club.Region.Java).founded(1927)
                        .colorPrimary("#16a34a").colorSecondary("#bbf7d0")
                        .crestEmoji("").logo("/logo/Persebaya Surabaya.png")
                        .vibe(List.of("ultras", "veteran", "attacking"))
                        .motto("Bajul Ijo").build(),
                Club.builder().id("arema").name("Arema FC").shortName("ARM")
                        .city("Malang").region(Club.Region.Java).founded(1987)
                        .colorPrimary("#1d4ed8").colorSecondary("#facc15")
                        .crestEmoji("").logo("/logo/Arema.png")
                        .vibe(List.of("ultras", "attacking", "youth"))
                        .motto("Singo Edan").build(),
                Club.builder().id("persis").name("Persis Solo").shortName("PRS")
                        .city("Surakarta").region(Club.Region.Java).founded(1923)
                        .colorPrimary("#dc2626").colorSecondary("#ffffff")
                        .crestEmoji("").logo("/logo/Persis Solo.png")
                        .vibe(List.of("veteran", "ultras", "youth"))
                        .motto("Laskar Sambernyawa").build(),
                Club.builder().id("psim").name("PSIM Yogyakarta").shortName("PSI")
                        .city("Yogyakarta").region(Club.Region.Java).founded(1929)
                        .colorPrimary("#dc2626").colorSecondary("#fef08a")
                        .crestEmoji("").logo("/logo/PSIM.png")
                        .vibe(List.of("veteran", "ultras"))
                        .motto("Laskar Mataram").build(),
                Club.builder().id("persik").name("Persik Kediri").shortName("PKD")
                        .city("Kediri").region(Club.Region.Java).founded(1950)
                        .colorPrimary("#7c3aed").colorSecondary("#f59e0b")
                        .crestEmoji("").logo("/logo/Persik Kediri.png")
                        .vibe(List.of("attacking", "veteran"))
                        .motto("Macan Putih").build(),
                Club.builder().id("persijap").name("Persijap Jepara").shortName("PJP")
                        .city("Jepara").region(Club.Region.Java).founded(1954)
                        .colorPrimary("#dc2626").colorSecondary("#fbbf24")
                        .crestEmoji("").logo("/logo/Persijap.png")
                        .vibe(List.of("youth", "family"))
                        .motto("Laskar Kalinyamat").build(),
                Club.builder().id("persita").name("Persita Tangerang").shortName("PST")
                        .city("Tangerang").region(Club.Region.Java).founded(1994)
                        .colorPrimary("#7c3aed").colorSecondary("#f8a4ac")
                        .crestEmoji("").logo("/logo/Persita.png")
                        .vibe(List.of("youth", "family"))
                        .motto("Pendekar Cisadane").build(),
                Club.builder().id("madura").name("Madura United").shortName("MDU")
                        .city("Pamekasan").region(Club.Region.Java).founded(2015)
                        .colorPrimary("#dc2626").colorSecondary("#1e40af")
                        .crestEmoji("").logo("/logo/Madura United.png")
                        .vibe(List.of("attacking", "youth"))
                        .motto("Laskar Sape Kerap").build(),
                Club.builder().id("dewa").name("Dewa United FC").shortName("DWU")
                        .city("Tangerang").region(Club.Region.Java).founded(2010)
                        .colorPrimary("#0f172a").colorSecondary("#f59e0b")
                        .crestEmoji("").logo("/logo/Dewa United.png")
                        .vibe(List.of("attacking", "youth"))
                        .motto("Laskar Cisadane").build(),
                Club.builder().id("bhayangkara").name("Bhayangkara Presisi").shortName("BHP")
                        .city("Jakarta").region(Club.Region.Java).founded(2014)
                        .colorPrimary("#dc2626").colorSecondary("#1e3a5f")
                        .crestEmoji("").logo("/logo/Bhayangkara Presisi.png")
                        .vibe(List.of("pragmatic", "youth"))
                        .motto("Presisi").build(),
                Club.builder().id("psm").name("PSM Makassar").shortName("PSM")
                        .city("Makassar").region(Club.Region.Sulawesi).founded(1915)
                        .colorPrimary("#dc2626").colorSecondary("#fde68a")
                        .crestEmoji("").logo("/logo/PSM Makassar.png")
                        .vibe(List.of("pragmatic", "veteran", "family"))
                        .motto("Pasukan Ramang").build(),
                Club.builder().id("bali").name("Bali United").shortName("BLU")
                        .city("Gianyar").region(Club.Region.Bali).founded(1989)
                        .colorPrimary("#dc2626").colorSecondary("#fbbf24")
                        .crestEmoji("").logo("/logo/Bali United.png")
                        .vibe(List.of("youth", "attacking", "family"))
                        .motto("Serdadu Tridatu").build(),
                Club.builder().id("borneo").name("Borneo FC").shortName("BFC")
                        .city("Samarinda").region(Club.Region.Kalimantan).founded(2014)
                        .colorPrimary("#dc2626").colorSecondary("#fbbf24")
                        .crestEmoji("").logo("/logo/Borneo FC.png")
                        .vibe(List.of("attacking", "youth"))
                        .motto("Pesut Etam").build(),
                Club.builder().id("malut").name("Malut United").shortName("MLU")
                        .city("Ternate").region(Club.Region.Other).founded(2023)
                        .colorPrimary("#1e3a5f").colorSecondary("#f59e0b")
                        .crestEmoji("").logo("/logo/Malut United.png")
                        .vibe(List.of("youth", "family"))
                        .motto("Laskar Kie Raha").build(),
                Club.builder().id("semenpadang").name("Semen Padang").shortName("SPD")
                        .city("Padang").region(Club.Region.Sumatra).founded(1980)
                        .colorPrimary("#dc2626").colorSecondary("#f59e0b")
                        .crestEmoji("").logo("/logo/Semen Padang.png")
                        .vibe(List.of("veteran", "pragmatic", "family"))
                        .motto("Kabau Sirah").build(),
                Club.builder().id("psbs").name("PSBS Biak").shortName("PBS")
                        .city("Biak").region(Club.Region.Other).founded(1971)
                        .colorPrimary("#0f172a").colorSecondary("#22d3ee")
                        .crestEmoji("").logo("/logo/PSBS Biak.png")
                        .vibe(List.of("youth", "attacking"))
                        .motto("Badai Pasifik").build(),
                Club.builder().id("psis").name("PSIS Semarang").shortName("PSS")
                        .city("Semarang").region(Club.Region.Java).founded(1932)
                        .colorPrimary("#0ea5e9").colorSecondary("#bae6fd")
                        .crestEmoji("").logo(null)
                        .vibe(List.of("pragmatic", "youth"))
                        .motto("Mahesa Jenar").build(),
                Club.builder().id("psssleman").name("PSS Sleman").shortName("PSL")
                        .city("Sleman").region(Club.Region.Java).founded(1976)
                        .colorPrimary("#16a34a").colorSecondary("#bbf7d0")
                        .crestEmoji("").logo(null)
                        .vibe(List.of("youth", "ultras", "family"))
                        .motto("Super Elja").build()
        );
        clubRepo.saveAll(seed);
        log.info("Seeded {} Liga 1 clubs.", seed.size());
    }
}
