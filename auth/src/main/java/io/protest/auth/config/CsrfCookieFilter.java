package io.protest.auth.config;

import java.io.IOException;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CsrfCookieFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // Извлечение CSRF-токен, который Spring Security подготовил для запроса
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            // Принудительный вызов getToken(), чтобы токен сгенерировался и записался в Cookie
            csrfToken.getToken();
        }
        // Передача запроса дальше по цепочке фильтров
        filterChain.doFilter(request, response);
    }
}
