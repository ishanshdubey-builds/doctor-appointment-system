package com.das.pro.dasprorestjpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private LoginRepo loginRepo;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserInfoEntity loginRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            String token = authService.authenticateUser(loginRequest.getUser_id(), loginRequest.getPassword());
            UserInfoEntity user = loginRepo.findById(loginRequest.getUser_id()).orElse(null);
            
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("user_id", user.getUser_id());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody UserInfoEntity user) {
        Map<String, Object> response = new HashMap<>();
        try {
            authService.registerUser(user);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
