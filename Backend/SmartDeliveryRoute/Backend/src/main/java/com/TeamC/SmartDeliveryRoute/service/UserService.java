package com.TeamC.SmartDeliveryRoute.service;

import com.TeamC.SmartDeliveryRoute.model.User;
import com.TeamC.SmartDeliveryRoute.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) {
        this.repo = repo;
    }
    public User addUser(User user){
        return repo.save(user);
    }
    public long getTotalUsers(){
        return repo.count();
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public Optional<User> getUserById(String id) {
        return repo.findById(id);
    }

    public Optional<User> updateUser(String id, User userDetails) {
        return repo.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            return repo.save(user);
        });
    }

    public boolean deleteUser(String id) {
        return repo.findById(id).map(user -> {
            repo.delete(user);
            return true;
        }).orElse(false);
    }
}
