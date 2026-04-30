package com.das.pro.dasprorestjpa;

//MAIN CLASS
// Import primary Spring Application bootstrapping engines
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.Bean;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Annotation defining root boundary triggering Component Scans, Configuration loading, and Auto-Config behaviors 
@SpringBootApplication
public class DasProRestJpaApplication {

	// Native Entry point mapping command-line executions directly into embedded
	// Tomcat lifecycle hooks
	public static void main(String[] args) {
		SpringApplication.run(DasProRestJpaApplication.class, args);
	}

	// // Inject universal CORS policy filtering globally to avoid per-controller
	// repetitions natively
	// @Bean
	// public WebMvcConfigurer corsConfigurer(){
	// return new WebMvcConfigurer() {

	// // Override standard mapping opening up precise React ports
	// @Override
	// public void addCorsMappings(CorsRegistry registry) {
	// // Map wildcard routing paths
	// registry.addMapping("/**")
	// // Explicitly allow Create React App default port 3000 through the security
	// gateway
	// .allowedOrigins("http://localhost:3000/")
	// // Allow standard REST nouns (GET, POST, PUT, DELETE) globally
	// .allowedMethods("*");

	// }
	// };
	// }

}
