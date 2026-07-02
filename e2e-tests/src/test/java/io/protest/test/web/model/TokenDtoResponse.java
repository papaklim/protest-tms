package io.protest.test.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TokenDtoResponse(
    @JsonProperty("access_token") String accessToken,
    @JsonProperty("id_token") String idToken,
    @JsonProperty("refresh_token") String refreshToken,
    @JsonProperty("token_type") String tokenType,
    @JsonProperty("expires_in") Long expiresIn) {
}
