package com.marcosdias.apitodo.business.service;

import com.marcosdias.apitodo.controller.dto.AuthResponse;
import com.marcosdias.apitodo.controller.dto.LoginRequest;
import com.marcosdias.apitodo.controller.dto.RegisterRequest;
import com.marcosdias.apitodo.domain.entity.Usuario;
import com.marcosdias.apitodo.infra.exception.UnprocessableEntityException;
import com.marcosdias.apitodo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new UnprocessableEntityException("Email já cadastrado");
        }
        Usuario usuario = new Usuario();
        usuario.setEmail(request.email());
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuarioRepository.save(usuario);
        log.info("Usuário registrado: {}", request.email());
        return new AuthResponse(jwtService.generateToken(usuario), usuario.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow();
        log.info("Usuário autenticado: {}", request.email());
        return new AuthResponse(jwtService.generateToken(usuario), usuario.getEmail());
    }
}
