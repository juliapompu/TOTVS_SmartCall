package com.totvs.smartcall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * TOTVS SmartCall - Classe principal da aplicação
 * Ponto de entrada do Spring Boot.
 * Execute esta classe para iniciar o servidor na porta 8080.
 */
@SpringBootApplication
public class SmartCallApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCallApplication.class, args);
        System.out.println("===========================================");
        System.out.println("  TOTVS SmartCall Backend iniciado!");
        System.out.println("  Acesse: http://localhost:8080");
        System.out.println("===========================================");
    }
}
