package io.protest.runs.data.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import io.protest.runs.model.enums.RunResultStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "test_run_results")
public class RunResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_id", nullable = false)
    private RunEntity run;
    @Column(name = "testcase_id", nullable = false)
    private UUID testcaseId;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RunResultStatus status = RunResultStatus.UNTESTED;
    @Column(name = "assignee_id")
    private UUID assigneeId;
    @Column(name = "comment")
    private String comment;
    @Column(name = "executed_at")
    private LocalDateTime executedAt;
    @Column(name = "executor_id")
    private UUID executorId;
}
