package com.example.correos_pacientes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@EnableScheduling
@SpringBootApplication
public class CorreosPacientesApplication {

	public static void main(String[] args) {
		SpringApplication.run(CorreosPacientesApplication.class, args);
	}

}
