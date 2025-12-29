package com.smartdelivery.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // ⚠️ DEBUG PRINT: This will show in your terminal if the file is loaded correctly
        System.out.println("⚠️ SECURITY CONFIG LOADED: ALLOWING ALL REQUESTS (Login Disabled) ⚠️");

        http
                // 1. Disable CSRF (Security tokens) so React/Postman can talk to Backend
                .csrf(csrf -> csrf.disable())

                // 2. Enable CORS (Allow React localhost:3000 to connect)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. ALLOW EVERYTHING (The Fix)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // <--- This allows ALL traffic. No 403 errors possible.
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow Frontend URL
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));

        // Allow all HTTP methods (GET, POST, PUT, DELETE)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}