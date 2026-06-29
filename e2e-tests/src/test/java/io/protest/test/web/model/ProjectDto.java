package io.protest.test.web.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProjectDto(
    @JsonProperty("id") UUID id,
    @JsonProperty("name") String name,
    @JsonProperty("description") String description
) {
}
