package com.smartdelivery.backend.controller;

import com.smartdelivery.backend.model.Driver;
import com.smartdelivery.backend.model.Order;
import com.smartdelivery.backend.repository.DriverRepository;
import com.smartdelivery.backend.repository.OrderRepository;
import com.smartdelivery.backend.service.GroqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate; // ✅ REQUIRED for "Today's Deliveries"
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private DriverRepository driverRepo;

    @Autowired
    private GroqService groqService;

    @Autowired
    private com.smartdelivery.backend.repository.UserRepository userRepo;

    // ==========================================
    // 📊 ADMIN DASHBOARD & ANALYTICS
    // ==========================================

    @GetMapping("/admin/stats")
    public Map<String, Object> getStats() {
        long totalDrivers = driverRepo.count();
        long totalOrders = orderRepo.count();

        // ✅ NEW LOGIC: Count ONLY orders delivered TODAY
        long deliveredToday = orderRepo.findAll().stream()
                .filter(o -> "Delivered".equalsIgnoreCase(o.getStatus()))
                .filter(o -> o.getDeliveryDate() != null && o.getDeliveryDate().equals(LocalDate.now()))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalDrivers", totalDrivers);
        response.put("totalOrders", totalOrders);
        response.put("deliveredToday", deliveredToday);
        return response;
    }

    @GetMapping("/admin/analytics")
    public Map<String, Object> getAnalytics() {
        List<Order> orders = orderRepo.findAll();
        long weekly = orders.size();
        long monthly = orders.size();
        long pending = orders.stream().filter(o -> !"Delivered".equalsIgnoreCase(o.getStatus())).count();
        double revenue = orders.stream().filter(o -> "Delivered".equalsIgnoreCase(o.getStatus())).mapToDouble(Order::getPrice).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("weekly", weekly);
        stats.put("monthly", monthly);
        stats.put("pending", pending);
        stats.put("revenue", revenue);
        return stats;
    }

    @GetMapping("/admin/analytics/driver")
    public Map<String, Object> getDriverAnalytics(@RequestParam String email) {
        List<Order> orders = orderRepo.findAll().stream()
                .filter(o -> o.getDriver() != null && (o.getDriver().equalsIgnoreCase(email) || o.getDriver().contains(email)))
                .collect(Collectors.toList());

        long completed = orders.stream().filter(o -> "Delivered".equalsIgnoreCase(o.getStatus())).count();
        double revenue = orders.stream().filter(o -> "Delivered".equalsIgnoreCase(o.getStatus())).mapToDouble(Order::getPrice).sum();
        long pending = orders.stream().filter(o -> !"Delivered".equalsIgnoreCase(o.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("completed", completed);
        stats.put("revenue", revenue);
        stats.put("pending", pending);
        return stats;
    }

    @GetMapping("/admin/driver-report")
    public Map<String, String> getDriverReport(@RequestParam String email) {
        List<Order> orders = orderRepo.findAll().stream()
                .filter(o -> o.getDriver() != null && o.getDriver().contains(email))
                .collect(Collectors.toList());

        String report = groqService.generateDriverReport(email, orders);

        Map<String, String> response = new HashMap<>();
        response.put("report", report);
        return response;
    }

    // ==========================================
    // 🚚 DRIVER MANAGEMENT (Admin Side)
    // ==========================================

    @GetMapping("/admin/drivers")
    public List<Driver> getAllDrivers() {
        return driverRepo.findAll();
    }

    @GetMapping("/admin/driver-location")
    public Map<String, Double> getDriverLocation(@RequestParam String email) {
        Driver driver = driverRepo.findByEmail(email);

        if (driver == null) {
            driver = driverRepo.findAll().stream()
                    .filter(d -> d.getEmail().equalsIgnoreCase(email))
                    .findFirst().orElse(null);
        }

        Map<String, Double> location = new HashMap<>();
        if (driver != null) {
            location.put("lat", driver.getCurrentLat());
            location.put("lng", driver.getCurrentLng());
        }
        return location;
    }

    @PostMapping("/admin/drivers/create")
    public Driver createDriver(@RequestBody Driver driver) {
        if (driver.getStatus() == null || driver.getStatus().isEmpty()) {
            driver.setStatus("Offline");
        }
        return driverRepo.save(driver);
    }

    @PostMapping("/admin/drivers/update-status")
    public String updateDriverStatus(@RequestParam String email, @RequestParam String status) {
        Driver driver = driverRepo.findByEmail(email);

        if (driver == null) {
            driver = driverRepo.findAll().stream()
                    .filter(d -> d.getEmail().equalsIgnoreCase(email))
                    .findFirst().orElse(null);
        }

        if (driver != null) {
            driver.setStatus(status);
            driverRepo.save(driver);
            return "Driver status updated to " + status;
        }
        return "Driver not found";
    }

    @DeleteMapping("/admin/drivers/reset")
    public String deleteAllDrivers() {
        driverRepo.deleteAll();
        return "All drivers have been deleted. Database is clean.";
    }

    // ==========================================
    // 📦 ORDER MANAGEMENT
    // ==========================================

    @GetMapping("/admin/orders")
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    @PostMapping("/admin/orders/create")
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("Assigned");
        order.setDriver("Unassigned");
        order.setPrice(0.0);
        return orderRepo.save(order);
    }

    @PostMapping("/admin/assign")
    public String assignDriver(@RequestParam String orderId, @RequestParam String driverName) {
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            order.setDriver(driverName);
            order.setStatus("Assigned");
            order.setPrice(40.0 + (Math.random() * 50));
            orderRepo.save(order);
            return "Driver Assigned";
        }
        return "Order Not Found";
    }

    // ==========================================
    // 📱 DRIVER APP API
    // ==========================================

    @GetMapping("/driver/my-orders")
    public List<Order> getDriverOrders(@RequestParam String driverName) {
        return orderRepo.findAll().stream()
                .filter(o -> o.getDriver() != null &&
                        (o.getDriver().equalsIgnoreCase(driverName) || o.getDriver().contains(driverName)))
                .filter(o -> !"Delivered".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());
    }

    @GetMapping("/driver/history")
    public List<Order> getDriverHistory(@RequestParam String driverName) {
        List<Order> history = orderRepo.findAll().stream()
                .filter(o -> o.getDriver() != null &&
                        (o.getDriver().equalsIgnoreCase(driverName) || o.getDriver().contains(driverName)))
                .filter(o -> "Delivered".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());

        Collections.reverse(history);
        return history.stream().limit(5).collect(Collectors.toList());
    }

    @PostMapping("/driver/accept")
    public String acceptOrder(@RequestParam String orderId) {
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus("Accepted");
            orderRepo.save(order);
            return "Order Accepted";
        }
        return "Error";
    }

    @PostMapping("/driver/reject")
    public String rejectOrder(@RequestParam String orderId) {
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            order.setDriver("Unassigned");
            order.setStatus("Assigned");
            orderRepo.save(order);
            return "Order Rejected";
        }
        return "Error";
    }

    @PostMapping("/driver/update-status")
    public String updateOrderStatus(@RequestParam String orderId, @RequestParam String status) {
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus(status);
            orderRepo.save(order);
            return "Status Updated to " + status;
        }
        return "Order not found";
    }

    // ✅ FIXED: Saves the Date when completing!
    @PostMapping("/driver/complete")
    public String completeOrder(@RequestParam String orderId) {
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus("Delivered");
            order.setDeliveryDate(LocalDate.now()); // 📅 Save Today's Date
            orderRepo.save(order);
            return "Order Delivered";
        }
        return "Error";
    }

    // ✅ LIVE TRACKING: Receives GPS Coordinates
    @PostMapping("/driver/update-location")
    public String updateDriverLocation(@RequestParam String email, @RequestParam double lat, @RequestParam double lng) {
        Driver driver = driverRepo.findByEmail(email);
        if(driver == null) {
            driver = driverRepo.findAll().stream()
                    .filter(d -> d.getEmail().equalsIgnoreCase(email) || d.getName().equalsIgnoreCase(email))
                    .findFirst().orElse(null);
        }
        if (driver != null) {
            driver.setCurrentLat(lat);
            driver.setCurrentLng(lng);
            driverRepo.save(driver);
            return "Location Updated";
        }
        return "Driver not found";
    }

    @GetMapping("/admin/system/reset-all")
    public String resetSystem() {
        driverRepo.deleteAll();
        orderRepo.deleteAll();
        userRepo.deleteAll();
        return "SYSTEM RESET SUCCESSFUL";
    }
}