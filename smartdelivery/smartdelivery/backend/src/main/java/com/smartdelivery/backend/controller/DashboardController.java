package com.smartdelivery.backend.controller;

import com.smartdelivery.backend.model.*;
import com.smartdelivery.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow React Frontend to access this
public class DashboardController {

    @Autowired private OrderRepository orderRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private DriverRepository driverRepo;
    // @Autowired private TrafficRepository trafficRepo;
    // ... autowire the rest ...

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepo.findAll();
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/drivers")
    public List<Driver> getDrivers() {
        return driverRepo.findAll();
    }

    // Add endpoints for /traffic, /routes, etc. following the pattern above
}