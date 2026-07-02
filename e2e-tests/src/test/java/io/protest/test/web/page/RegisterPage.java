package io.protest.test.web.page;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Condition.text;
import io.protest.test.web.component.RegisterForm;

public class RegisterPage {
    private final RegisterForm registerForm = new RegisterForm($(".auth-card"));

    public RegisterForm getRegisterForm() {
        return registerForm;
    }

    public void registerFormShouldBeVisible() {
        registerForm.shouldBeVisible();
    }
}
