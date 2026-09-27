package com.azure.keyvault.secret;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SecretServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecretServiceApplication.class, args);
    }
}
