CREATE TABLE users (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    username varchar(50) NOT NULL UNIQUE,
    password varchar(500) NOT NULL,
    enabled boolean NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

CREATE TABLE authorities (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    authority varchar(50) NOT NULL,
    CONSTRAINT pk_authorities PRIMARY KEY (id),
    CONSTRAINT fk_authorities_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_authority ON authorities (user_id, authority);