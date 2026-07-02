package io.protest.gateway.model.dto;

import java.util.List;
import java.util.UUID;

public record CreateRunRequest(
    UUID projectId,
    String title,
    String description,
    List<UUID> testcaseIds
) {
}
