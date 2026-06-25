package io.protest.webutils.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.protest.webutils.advice.CustomRestExceptionHandler;

@Configuration
public class WebUtilsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public CustomRestExceptionHandler customRestExceptionHandler() {
        return new CustomRestExceptionHandler();
    }
}
