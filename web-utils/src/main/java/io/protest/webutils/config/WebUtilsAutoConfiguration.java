package io.protest.webutils.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.protest.webutils.advice.CustomRestExceptionHandler;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class WebUtilsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public CustomRestExceptionHandler customRestExceptionHandler() {
        return new CustomRestExceptionHandler();
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnClass(OpenAPI.class)
    public OpenAPI customOpenAPI() {
        return new OpenAPI().addSecurityItem(new SecurityRequirement().addList("Bearer Authentication")).components(
                new Components().addSecuritySchemes(
                        "Bearer Authentication",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).bearerFormat("JWT").scheme("bearer")
                ));
    }
}
