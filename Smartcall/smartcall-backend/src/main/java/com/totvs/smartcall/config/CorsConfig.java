package com.totvs.smartcall.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * Configuração de CORS (Cross-Origin Resource Sharing)
 *
 * Sem isso, o React rodando em localhost:3000 não consegue
 * fazer requisições para o backend em localhost:8080.
 * O navegador bloqueia por segurança chamadas entre origens diferentes.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Lê o valor do application.properties
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")         // Aplica para todas as rotas /api/
                .allowedOrigins(allowedOrigins) // Permite só o React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
