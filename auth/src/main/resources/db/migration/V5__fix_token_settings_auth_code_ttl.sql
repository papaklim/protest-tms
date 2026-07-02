-- Добавление settings.token.authorization-code-time-to-live в token_settings для корректной работы Spring Security 7.x
UPDATE oauth2_registered_client
SET token_settings = '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.access-token-time-to-live":["java.time.Duration",3600.000000000],"settings.token.refresh-token-time-to-live":["java.time.Duration",604800.000000000],"settings.token.reuse-refresh-tokens":true,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"],"settings.token.authorization-code-time-to-live":["java.time.Duration",300.000000000]}'
WHERE client_id IN ('client', 'gateway-client');
