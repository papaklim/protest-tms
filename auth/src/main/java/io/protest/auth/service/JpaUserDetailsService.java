package io.protest.auth.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.protest.auth.data.entity.UserEntity;
import io.protest.auth.data.repository.UserRepository;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public JpaUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Пользователь не найден: " + username));
        List<SimpleGrantedAuthority> grantedAuthorities = userEntity.getAuthorities().stream().map(
                auth -> new SimpleGrantedAuthority(auth.getAuthority())).collect(Collectors.toList());
        return new User(
                userEntity.getId().toString(),
                userEntity.getPassword(),
                userEntity.isEnabled(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                grantedAuthorities
        );
    }
}
