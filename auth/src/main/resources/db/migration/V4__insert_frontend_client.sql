-- Регистрация публичного клиента для React SPA фронтенда
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
        'client',
        CURRENT_TIMESTAMP,
        NULL, -- Публичный клиент не использует секрет
        NULL,
        'ProTEST React Frontend Client',
        'none', -- Аутентификация клиента отсутствует (Public Client)
        'authorization_code,refresh_token',
        'http://localhost:3000/authorized',
        'http://localhost:3000/logged-out',
        'openid,profile',
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":true,"settings.client.require-authorization-consent":false}',
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.access-token-time-to-live":["java.time.Duration",3600.000000000],"settings.token.refresh-token-time-to-live":["java.time.Duration",604800.000000000],"settings.token.reuse-refresh-tokens":true,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"]}'
    );
