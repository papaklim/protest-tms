CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    expected_result TEXT,
    type VARCHAR(50),
    preconditions TEXT,
    postconditions TEXT,
    layer VARCHAR(50),
    automated BOOLEAN,
    author_id UUID,
    created_at TIMESTAMP,
    last_modified_at TIMESTAMP,
    custom_fields JSONB
);