package com.smartdelivery.backend.repository;
import com.smartdelivery.backend.model.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface InventoryRepository extends MongoRepository<Inventory, String> {}