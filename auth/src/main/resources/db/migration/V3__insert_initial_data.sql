-- 1. Регистрируем OAuth2-клиент для Gateway (используем bcrypt для секрета 'secret')
INSERT INTO
    oauth2_registered_client (
        id,
        client_id,
        client_id_issued_at,
        client_secret,
        client_secret_expires_at,
        client_name,
        client_authentication_methods,
        authorization_grant_types,
        redirect_uris,
        post_logout_redirect_uris,
        scopes,
        client_settings,
        token_settings
    )
VALUES (
        gen_random_uuid ()::text,
        'gateway-client',
        CURRENT_TIMESTAMP,
        '{bcrypt}$2a$10$MvkgFAbdikyrqm6P5A3Q4OBIXjHvE534LlFZdprxGQst1H2SJ4VUG', -- bcrypt хэш для 'secret'
        NULL,
        'ProTEST API Gateway Client',
        'client_secret_basic',
        'authorization_code,refresh_token,client_credentials',
        'http://localhost:8080/login/oauth2/code/gateway-client',
        'http://localhost:8080/logged-out',
        'openid,profile',
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":true}',
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.access-token-time-to-live":["java.time.Duration",3600.000000000],"settings.token.refresh-token-time-to-live":["java.time.Duration",604800.000000000],"settings.token.reuse-refresh-tokens":true,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"]}'
    );

-- 2. Создаем тестового пользователя admin с паролем 'password'
INSERT INTO
    users (
        id,
        username,
        password,
        enabled
    )
VALUES (
        '99999999-9999-9999-9999-999999999999',
        'admin',
        '{bcrypt}$2b$10$FMy/At2oQ6A.13Vgx6pYZe9omX0eTQaQV7nKQo7rXXLqQ679vLGhO', -- bcrypt хэш для 'password'
        TRUE
    );

-- Назначаем права администратора
INSERT INTO
    authorities (user_id, authority)
VALUES (
        '99999999-9999-9999-9999-999999999999',
        'ROLE_ADMIN'
    );