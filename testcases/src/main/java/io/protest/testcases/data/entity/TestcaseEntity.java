package io.protest.testcases.data.entity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import io.protest.testcases.model.enums.Layer;
import io.protest.testcases.model.enums.TestcaseStatus;
import io.protest.testcases.model.enums.TestcaseType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "test_cases")
public class TestcaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TestcaseStatus status;

    @Column(name = "expected_result")
    private String expectedResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TestcaseType testType;

    @Column(name = "preconditions")
    private String preconditions;

    @Column(name = "postconditions")
    private String postconditions;

    @Enumerated(EnumType.STRING)
    @Column(name = "layer")
    private Layer layer;

    @Column(name = "automated")
    private boolean isAutomated;

    @Column(name = "author_id")
    private UUID authorId;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custom_fields", columnDefinition = "jsonb")
    private Map<String, String> customFields = new HashMap<>();

    @Column(name = "section")
    private String section;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "steps", columnDefinition = "jsonb")
    private List<Map<String, Object>> steps;
}
