-- Убираем префикс ROLE_ у существующего админа, созданного в V3
UPDATE authorities SET authority = 'ADMIN' WHERE authority = 'ROLE_ADMIN';

-- Хэш пароля 'password': '$2b$10$FMy/At2oQ6A.13Vgx6pYZe9omX0eTQaQV7nKQo7rXXLqQ679vLGhO'
-- Вставляем пользователей
INSERT INTO users (username, password, enabled) VALUES 
('lead', '{bcrypt}$2b$10$FMy/At2oQ6A.13Vgx6pYZe9omX0eTQaQV7nKQo7rXXLqQ679vLGhO', true),
('tester', '{bcrypt}$2b$10$FMy/At2oQ6A.13Vgx6pYZe9omX0eTQaQV7nKQo7rXXLqQ679vLGhO', true),
('guest', '{bcrypt}$2b$10$FMy/At2oQ6A.13Vgx6pYZe9omX0eTQaQV7nKQo7rXXLqQ679vLGhO', true);

-- Назначаем роли без префикса ROLE_
INSERT INTO authorities (user_id, authority) VALUES 
((SELECT id FROM users WHERE username = 'lead'), 'LEAD'),
((SELECT id FROM users WHERE username = 'tester'), 'TESTER'),
((SELECT id FROM users WHERE username = 'guest'), 'GUEST');
