package ULTRAS.example.UltrasBackend.Club;

import java.util.List;

/**
 * DTO that mirrors the frontend's {@code Club} type exactly so the Next.js
 * app can JSON.parse the response straight into its existing type with no
 * mapping. Notably, {@code colors} is a two-element array — we store the
 * pair as separate columns on the entity, but serialize as the tuple shape
 * the UI expects.
 */
public final class ClubDtos {

    private ClubDtos() {}

    public record FrontendClub(
            String id,
            String name,
            String shortName,
            String city,
            String region,
            int founded,
            List<String> colors,
            String crestEmoji,
            String logo,
            List<String> vibe,
            String motto
    ) {
        public static FrontendClub from(Club c) {
            return new FrontendClub(
                    c.getId(),
                    c.getName(),
                    c.getShortName(),
                    c.getCity(),
                    c.getRegion().name(),
                    c.getFounded(),
                    List.of(c.getColorPrimary(), c.getColorSecondary()),
                    c.getCrestEmoji() == null ? "" : c.getCrestEmoji(),
                    c.getLogo(),
                    c.getVibe(),
                    c.getMotto()
            );
        }
    }
}
