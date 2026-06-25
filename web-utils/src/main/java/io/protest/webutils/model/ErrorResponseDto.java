package io.protest.webutils.model;

import jakarta.annotation.Nonnull;

public record ErrorResponseDto(
    @Nonnull String type,
    @Nonnull String title,
    int status,
    @Nonnull String detail,
    @Nonnull String instance
) {
}
