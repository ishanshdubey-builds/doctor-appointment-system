package com.das.pro.dasprorestjpa;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DasApi {
    private final LoginRepo loginRepo;

    public DasApi(LoginRepo loginRepo) {
        this.loginRepo = loginRepo;
    }

    // Public only because registration checks username availability before creating an account.
    @GetMapping("/checkuserId")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String user_id) {
        if (user_id == null || user_id.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("available", false));
        }
        Optional<UserInfoEntity> existingUser = loginRepo.findById(user_id.trim());
        return ResponseEntity.ok(Map.of("available", existingUser.isEmpty()));
    }
}
