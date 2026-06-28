package io.protest.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import io.protest.auth.model.RegistrationForm;
import io.protest.auth.service.UserService;
import jakarta.validation.Valid;

@Controller
public class RegisterController {

    private static final String REGISTRATION_VIEW_NAME = "register";
    private static final String LOGIN_VIEW_NAME = "login";

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String root(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return "redirect:http://localhost:3000";
        }
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String getLoginPage() {
        return LOGIN_VIEW_NAME;
    }

    @GetMapping("/register")
    public String getRegisterPage(Model model) {
        model.addAttribute("registrationForm", new RegistrationForm("", "", ""));
        return REGISTRATION_VIEW_NAME;
    }

    @PostMapping("/register")
    public String registerUser(
            @Valid @ModelAttribute("registrationForm") RegistrationForm registrationForm, BindingResult bindingResult, Model model) {

        if (!bindingResult.hasErrors()) {
            if (!registrationForm.password().equals(registrationForm.passwordSubmit())) {
                bindingResult.addError(new FieldError("registrationForm", "passwordSubmit", "Пароли не совпадают"));
            } else {
                try {
                    userService.registerUser(registrationForm.username(), registrationForm.password());
                    model.addAttribute("username", registrationForm.username());
                    return REGISTRATION_VIEW_NAME;
                } catch (IllegalArgumentException e) {
                    bindingResult.addError(new FieldError("registrationForm", "username", e.getMessage()));
                }
            }
        }
        return REGISTRATION_VIEW_NAME;
    }
}
