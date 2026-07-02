package io.protest.gateway.model.dto;

import java.util.UUID;

public record UpdateResultRequest(
    String status,
    String comment,
    UUID assigneeId) {
}
