package io.protest.auth.service;

import java.util.ArrayList;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.protest.auth.data.entity.AuthorityEntity;
import io.protest.auth.data.entity.UserEntity;
import io.protest.auth.data.repository.UserRepository;
import jakarta.annotation.Nonnull;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String registerUser(@Nonnull String username, @Nonnull String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Пользователь с именем " + username + " уже существует");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setPassword(passwordEncoder.encode(password));
        userEntity.setEnabled(true);

        AuthorityEntity authority = new AuthorityEntity();
        authority.setUser(userEntity);
        authority.setAuthority("ROLE_USER");

        userEntity.setAuthorities(new ArrayList<>());
        userEntity.getAuthorities().add(authority);

        userRepository.save(userEntity);
        return username;
    }
}
