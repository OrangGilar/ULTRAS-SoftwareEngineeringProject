package ULTRAS.example.UltrasBackend.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User,UUID > {
    Optional<User>findByEmail(String email);
    boolean existByEmail(String email);
    boolean existByUsername(String Username);
    
}
