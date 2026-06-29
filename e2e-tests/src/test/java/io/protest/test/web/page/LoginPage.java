package io.protest.test.web.page;

import io.protest.test.web.component.LoginForm;
import static com.codeborne.selenide.Selenide.$;

public class LoginPage {
    private final LoginForm loginForm = new LoginForm($(".auth-card"));

    public LoginForm getLoginForm() {
        return loginForm;
    }

    public void loginFormShouldBeVisible() {
        loginForm.shouldBeVisible();
    }
}
