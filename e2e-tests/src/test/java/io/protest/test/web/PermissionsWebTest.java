package io.protest.test.web;

import static com.codeborne.selenide.Selenide.open;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.protest.test.web.jupiter.annotation.Project;
import io.protest.test.web.jupiter.annotation.User;
import io.protest.test.web.jupiter.annotation.Web;
import io.protest.test.web.jupiter.extension.UsersQueueExtension;
import io.protest.test.web.model.UserDto;
import io.protest.test.web.model.enums.UserType;
import io.protest.test.web.page.LoginPage;

@Web
@ExtendWith(UsersQueueExtension.class)

public class PermissionsWebTest {
    @BeforeEach
    void setUp() {
        open("/");
    }

    @Test
    @Project
    void adminShouldHaveFullAccess(@User(UserType.ADMIN) UserDto admin) {
        LoginPage loginPage = new LoginPage();
        loginPage.getLoginForm().setUserName(admin.username()).setPassword(
                admin.password()).submit().headerShouldBeVisible().createProjectButtonShouldBeVisible().controlProjectButtonsShouldBeVisible();
    }

    @Test
    @Project
    void leadShouldHaveFullAccess(@User(UserType.LEAD) UserDto lead) {
        LoginPage loginPage = new LoginPage();
        loginPage.getLoginForm().setUserName(lead.username()).setPassword(
                lead.password()).submit().headerShouldBeVisible().createProjectButtonShouldBeVisible().controlProjectButtonsShouldBeVisible();
    }

    @Test
    @Project
    void guestShouldHaveReadOnlyAccess(@User(UserType.GUEST) UserDto guest) {
        LoginPage loginPage = new LoginPage();
        loginPage.getLoginForm().setUserName(guest.username()).setPassword(
                guest.password()).submit().headerShouldBeVisible().createProjectButtonShouldNotBeVisible().controlProjectButtonsShouldNotBeVisible();
    }

    @Test
    @Project
    void testerShouldNotBeAbleToDeleteProjects(@User(UserType.TESTER) UserDto tester) {
        LoginPage loginPage = new LoginPage();
        loginPage.getLoginForm().setUserName(tester.username()).setPassword(
                tester.password()).submit().headerShouldBeVisible().createProjectButtonShouldNotBeVisible().controlProjectButtonsShouldNotBeVisible();
    }

}
