package com.TeamC.SmartDeliveryRoute.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

//import org.springframework.data.annotation.Id;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "Enter name")
    @Size(min = 2,max = 50,message = "Name is required and between 2 to 50 characters")
    private String name;

    @NotBlank(message = "Enter email")
    @Email(message = "Email should be valid")
    private String email;

    public User() {}

    public User(String id,String name, String email){
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getId(){
        return id;
    }
    public void setId(String id){
        this.id = id;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
}

