package ULTRAS.example.UltrasBackend.Cosmetic;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ULTRAS.example.UltrasBackend.User.UserCosmetic;
import ULTRAS.example.UltrasBackend.User.UserCosmeticRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cosmetics")
@RequiredArgsConstructor
public class CosmeticController {

    private final CosmeticService cosmeticService;

    // Browse the cosmetic shop
    @GetMapping
    public ResponseEntity<List<CosmeticItem>> browse(
            @RequestParam(required = false) String clubTag,
            @RequestParam(required = false) CosmeticItem.CosmeticType type) {
        return ResponseEntity.ok(cosmeticService.getAll(clubTag, type));
    }

    // View your own cosmetic collection
    @GetMapping("/my-collection")
    public ResponseEntity<List<UserCosmetic>> myCollection(@RequestAttribute UUID userId) {
        return ResponseEntity.ok(cosmeticService.getUserCollection(userId));
    }

    // Spend XP to unlock a cosmetic
    @PostMapping("/{cosmeticId}/purchase")
    public ResponseEntity<UserCosmetic> purchase(@PathVariable UUID cosmeticId,
                                                 @RequestAttribute UUID userId) {
        return ResponseEntity.ok(cosmeticService.purchase(userId, cosmeticId));
    }

    // Equip a cosmetic you own
    @PostMapping("/{cosmeticId}/equip")
    public ResponseEntity<UserCosmetic> equip(@PathVariable UUID cosmeticId,
                                              @RequestAttribute UUID userId) {
        return ResponseEntity.ok(cosmeticService.equip(userId, cosmeticId));
    }

    // Unequip a cosmetic
    @PostMapping("/{cosmeticId}/unequip")
    public ResponseEntity<UserCosmetic> unequip(@PathVariable UUID cosmeticId,
                                                @RequestAttribute UUID userId) {
        return ResponseEntity.ok(cosmeticService.unequip(userId, cosmeticId));
    }

    // Admin: add a new cosmetic item to the shop
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CosmeticItem> create(@RequestBody CosmeticItemRequest req) {
        return ResponseEntity.ok(cosmeticService.createItem(req));
    }
}

