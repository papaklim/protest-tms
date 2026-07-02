package io.protest.test.web.model;

import io.protest.test.web.model.enums.UserType;

public record UserDto(
    String username,
    String password,
    UserType userType
) {

}
