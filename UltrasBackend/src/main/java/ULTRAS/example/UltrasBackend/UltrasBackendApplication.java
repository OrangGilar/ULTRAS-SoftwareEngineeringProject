package ULTRAS.example.UltrasBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UltrasBackendApplication {

	public static void main(String[] args) {
		System.setProperty("spring.datasource.url", "jdbc:postgresql://ep-quiet-butterfly-aouh7hhj-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
		System.setProperty("spring.datasource.username", "neondb_owner");
		System.setProperty("spring.datasource.password", "npg_qRe4jnbEL7Vr");
		SpringApplication.run(UltrasBackendApplication.class, args);
	}

}
