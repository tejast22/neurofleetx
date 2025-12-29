package com.smartdelivery.backend.controller;

import com.smartdelivery.backend.model.Driver;
import com.smartdelivery.backend.model.User;
import com.smartdelivery.backend.repository.DriverRepository;
import com.smartdelivery.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Keeping your frontend setting
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    // ✅ ADDED THIS: Connects to the Driver Database
    @Autowired
    private DriverRepository driverRepo;

    // 1. REGISTER
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (userRepo.findByEmail(user.getEmail()) != null) {
            response.put("message", "Email already exists!");
            response.put("status", "error");
            return response;
        }

        // Set default values based on role for the User Login
        if ("DRIVER".equalsIgnoreCase(user.getRole())) {
            user.setStatus("Active");
            user.setCurrentLat(40.7128); // Default Lat
            user.setCurrentLng(-74.0060); // Default Lng
        } else {
            user.setStatus("Active"); // Admins are active by default
        }

        // 1. Save the User (So you can Login)
        userRepo.save(user);

        // -------------------------------------------------------------
        // ✅ NEW LOGIC: Also create a "Driver" profile for the Admin Panel
        // -------------------------------------------------------------
        if ("DRIVER".equalsIgnoreCase(user.getRole())) {
            // Check if they are already in the Driver list to avoid duplicates
            if (driverRepo.findByEmail(user.getEmail()) == null) {
                Driver newDriver = new Driver();
                newDriver.setName(user.getName());
                newDriver.setEmail(user.getEmail());
                newDriver.setPassword(user.getPassword());

                // ⚠️ CRITICAL: Set to "Available" so Admin sees them in the list!
                newDriver.setStatus("Available");

                // Copy location data
                newDriver.setCurrentLat(user.getCurrentLat());
                newDriver.setCurrentLng(user.getCurrentLng());

                driverRepo.save(newDriver);
            }
        }
        // -------------------------------------------------------------

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

        User user = userRepo.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            response.put("status", "success");
            response.put("role", user.getRole());
            response.put("name", user.getName());
            response.put("id", user.getId());
            // It's often useful to return the email too
            response.put("email", user.getEmail());
        } else {
            response.put("status", "error");
            response.put("message", "Invalid Credentials");
        }
        return response;
    }
}