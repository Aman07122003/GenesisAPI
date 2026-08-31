package com.example.genesis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Genesis Spring Boot application.
 *
 * <p>This class bootstraps the Spring application context and starts the
 * embedded web server. Spring Boot automatically discovers the controllers,
 * services, clients, configuration classes, and other components located
 * within the application package and its subpackages.</p>
 */
@SpringBootApplication
public class GenesisApplication {

	/**
	 * Starts the Genesis Spring Boot application.
	 *
	 * <p>The supplied command-line arguments are passed to Spring Boot
	 * during application startup.</p>
	 *
	 * @param args command-line arguments provided when starting the application
	 */
	public static void main(final String[] args) {
		SpringApplication.run(GenesisApplication.class, args);
	}
}