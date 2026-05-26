package ULTRAS.example.UltrasBackend.Club;

import ULTRAS.example.UltrasBackend.Common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepo;

    public List<ClubDtos.FrontendClub> getAll() {
        return clubRepo.findAll().stream()
                .sorted(Comparator.comparing(Club::getName))
                .map(ClubDtos.FrontendClub::from)
                .toList();
    }

    public ClubDtos.FrontendClub getById(String id) {
        Club c = clubRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Club '" + id + "' not found"));
        return ClubDtos.FrontendClub.from(c);
    }
}
