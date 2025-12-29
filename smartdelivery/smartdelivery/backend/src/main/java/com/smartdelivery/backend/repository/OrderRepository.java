package com.smartdelivery.backend.repository;
import com.smartdelivery.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByDriverAndStatusNot(String driver, String status);
}