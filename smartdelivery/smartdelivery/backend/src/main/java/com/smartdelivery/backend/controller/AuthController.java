package com.smartdelivery.backend.controller;

import com.smartdelivery.backend.model.Driver;
import com.smartdelivery.backend.model.User;
import com.smartdelivery.backend.repository.DriverRepository;
import com.smartdelivery.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // ✅ Added Missing Import
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    // ✅ FIXED: Renamed to match the bottom methods
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    // ✅ FIXED: Added missing storage for Reset Keys
    private static final Map<String, String> tokenStorage = new HashMap<>();

    // 1. REGISTER
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.findByEmail(user.getEmail()) != null) {
            response.put("message", "Email already exists!");
            response.put("status", "error");
            return response;
        }

        // Set default values based on role
        if ("DRIVER".equalsIgnoreCase(user.getRole())) {
            user.setStatus("Active");
            user.setCurrentLat(40.7128); // Default Lat
            user.setCurrentLng(-74.0060); // Default Lng
        } else {
            user.setStatus("Active");
        }

        userRepository.save(user);

        // Create Driver Profile if role is DRIVER
        if ("DRIVER".equalsIgnoreCase(user.getRole())) {
            if (driverRepository.findByEmail(user.getEmail()) == null) {
                Driver newDriver = new Driver();
                newDriver.setName(user.getName());
                newDriver.setEmail(user.getEmail());
                newDriver.setPassword(user.getPassword());
                newDriver.setStatus("Available");
                newDriver.setCurrentLat(user.getCurrentLat());
                newDriver.setCurrentLng(user.getCurrentLng());
                driverRepository.save(newDriver);
            }
        }

        response.put("message", "Registration Successful!");
        response.put("status", "success");
        return response;
    }

    // 2. LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            response.put("status", "success");
            response.put("role", user.getRole());
            response.put("name", user.getName());
            response.put("id", user.getId());
            response.put("email", user.getEmail());
        } else {
            response.put("status", "error");
            response.put("message", "Invalid Credentials");
        }
        return response;
    }

    // 3. FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email not found!"));
        }

        // Generate Key
        String resetKey = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        tokenStorage.put(email, resetKey);

        // PRINT TO CONSOLE
        System.out.println("\n========================================");
        System.out.println("🔐 PASSWORD RESET REQUEST");
        System.out.println("📧 Email: " + email);
        System.out.println("🔑 KEY: " + resetKey);
        System.out.println("========================================\n");

        return ResponseEntity.ok(Map.of("message", "Key generated! Check Console."));
    }

    // 4. RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String key = payload.get("key");
        String newPassword = payload.get("newPassword");

        if (!tokenStorage.containsKey(email) || !tokenStorage.get(email).equals(key)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Key!"));
        }

        // Update User Password
        User user = userRepository.findByEmail(email);
        user.setPassword(newPassword);
        userRepository.save(user);

        // Also Update Driver Password if they exist
        Driver driver = driverRepository.findByEmail(email);
        if (driver != null) {
            driver.setPassword(newPassword);
            driverRepository.save(driver);
        }

        tokenStorage.remove(email);

        return ResponseEntity.ok(Map.of("message", "Password Reset Successfully!"));
    }
}