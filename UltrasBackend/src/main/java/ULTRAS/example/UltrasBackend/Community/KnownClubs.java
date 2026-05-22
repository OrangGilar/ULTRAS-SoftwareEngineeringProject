package ULTRAS.example.UltrasBackend.Community;

import java.util.Set;

/**
 * Canonical Liga 1 club IDs accepted as community tags. Mirrors the
 * frontend's lib/mock/clubs.ts — keep both lists in sync when teams join
 * or leave the league.
 *
 * The string {@link #GENERAL_TAG} is a *sentinel* — not a club. Threads
 * with a null clubTag are surfaced under the "General" community, and the
 * frontend queries them by passing this sentinel as the clubTag param.
 * The service translates it into a "WHERE club_tag IS NULL" query rather
 * than treating it as a real tag, so the sentinel never gets persisted.
 */
public final class KnownClubs {

    private KnownClubs() {}

    /** Reserved query value meaning "threads with no club tag". Never stored. */
    public static final String GENERAL_TAG = "__general__";

    public static final Set<String> IDS = Set.of(
            "persija",
            "persib",
            "persebaya",
            "arema",
            "persis",
            "psim",
            "persik",
            "persijap",
            "persita",
            "madura",
            "dewa",
            "bhayangkara",
            "psm",
            "bali",
            "borneo",
            "malut",
            "semenpadang",
            "psbs",
            "psis",
            "psssleman"
    );

    public static boolean isValid(String id) {
        return id != null && IDS.contains(id);
    }
}
