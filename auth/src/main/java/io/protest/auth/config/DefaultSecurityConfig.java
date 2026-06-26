package io.protest.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class DefaultSecurityConfig {

    // 1. Настройка стандартной цепочки фильтров для веб-интерфейса
    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated() // Все запросы к серверу должны быть авторизованы
        )
                // Включение стандартной формы входа Spring Security (login page)
                .formLogin(Customizer.withDefaults());

        return http.build();
    }

    // 2. Настройка шифрования паролей. 
    // PasswordEncoderFactories.createDelegatingPasswordEncoder() по умолчанию использует BCrypt,
    // умеет распознавать префиксы вроде {bcrypt}, которые добавлены в SQL-миграции.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
