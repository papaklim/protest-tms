CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS test_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    project_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    creator_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_run_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    run_id UUID NOT NULL,
    testcase_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UNTESTED',
    assignee_id UUID,
    comment TEXT,
    executed_at TIMESTAMP,
    executor_id UUID,
    CONSTRAINT fk_test_run FOREIGN KEY (run_id) REFERENCES test_runs (id) ON DELETE CASCADE,
    CONSTRAINT uq_run_testcase UNIQUE (run_id, testcase_id)
);