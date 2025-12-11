package com.TeamC.SmartDeliveryRoute.repository;

import com.TeamC.SmartDeliveryRoute.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String>{
    boolean existsByEmail(String email);
}
