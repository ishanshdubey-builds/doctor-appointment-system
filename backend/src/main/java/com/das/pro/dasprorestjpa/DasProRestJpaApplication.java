package com.das.pro.dasprorestjpa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class DasProRestJpaApplication {
    public static void main(String[] args) {
        SpringApplication.run(DasProRestJpaApplication.class, args);
    }

    @RestController
    static class HealthController {
        @GetMapping("/health")
        public String health() {
            return "ok";
        }
    }
}
