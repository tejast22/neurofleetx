package com.smartdelivery.backend.repository;
import com.smartdelivery.backend.model.Driver;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface DriverRepository extends MongoRepository<Driver, String> {
    Driver findByEmail(String email);

    // We also use this as a backup in the code

}