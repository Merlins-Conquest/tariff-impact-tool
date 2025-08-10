package com.example.tariff_impact_tool.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        // For local dev UI + Azure Static Web Apps (replace with your final SWA URL when you have it)
        .allowedOrigins(
            "http://localhost:5173",
            "https://<your-swa-name>.azurestaticapps.net",
            "*" // keep * for quick demo; remove later for security
        )
        .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
        .allowedHeaders("*");
  }
}
