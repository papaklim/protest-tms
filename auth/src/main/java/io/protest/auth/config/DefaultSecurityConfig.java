package io.protest.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@Configuration
@EnableWebSecurity
public class DefaultSecurityConfig {

    // 1. Настройка стандартной цепочки фильтров для веб-интерфейса
    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(
                authorize -> authorize.requestMatchers(
                        "/error", "/login", "/register", "/.well-known/**", "/css/**",
                        "/favicon.ico").permitAll().anyRequest().authenticated()
        ).formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/", false).permitAll()
        ).logout(
                logout -> logout.logoutRequestMatcher(
                        PathPatternRequestMatcher.pathPattern("/logout")).logoutSuccessUrl(
                                "http://localhost:3000").permitAll()
        ).csrf(
                csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).csrfTokenRequestHandler(
                        new CsrfTokenRequestAttributeHandler())
        ).addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);

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
