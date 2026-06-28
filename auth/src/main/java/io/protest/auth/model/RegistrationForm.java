package io.protest.auth.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationForm(
    @NotBlank(message = "Имя пользователя не может быть пустым") @Size(min = 3, max = 50, message = "Имя пользователя должно быть от 3 до 50 символов") String username,
    @NotBlank(message = "Пароль не может быть пустым") @Size(min = 5, max = 32, message = "Пароль должен быть от 5 до 32 символов") String password,
    @NotBlank(message = "Подтверждение пароля не может быть пустым") String passwordSubmit
) {
}
