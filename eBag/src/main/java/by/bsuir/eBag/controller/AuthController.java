package by.bsuir.eBag.controller;

import by.bsuir.eBag.config.security.JWTUtil;
import by.bsuir.eBag.dto.AuthenticationDTO;
import by.bsuir.eBag.dto.UserDTO;
import by.bsuir.eBag.model.User;
import by.bsuir.eBag.service.RegistrationService;
import by.bsuir.eBag.util.UserValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.FieldError;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {

    private final RegistrationService registrationService;
    private final UserValidator userValidator;
    private final JWTUtil jwtUtil;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;

    @PostMapping("registration")
    public ResponseEntity<Map<String, String>> performRegistration(@RequestBody @Valid UserDTO userDTO,
                                                                   BindingResult bindingResult) {
        User user = modelMapper.map(userDTO, User.class);
        userValidator.validate(user, bindingResult);

        if (bindingResult.hasErrors()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", getErrorMessage(bindingResult)));
        }

        registrationService.register(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRole());
        return ResponseEntity.ok(Map.of("jwt-token", token));
    }

    @PostMapping("login")
    public ResponseEntity<Map<String, String>> performLogin(@RequestBody AuthenticationDTO authenticationDTO) {
        UsernamePasswordAuthenticationToken authInputToken =
                new UsernamePasswordAuthenticationToken(authenticationDTO.getUsername(),
                        authenticationDTO.getPassword());
        try {
            authenticationManager.authenticate(authInputToken);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Incorrect credentials!"));
        }

        User user = registrationService.findByUsername(authenticationDTO.getUsername());
        String token = jwtUtil.generateToken(authenticationDTO.getUsername(), user.getId(), user.getRole());

        return ResponseEntity.ok(Map.of("jwt-token", token));
    }

    private String getErrorMessage(BindingResult bindingResult) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
    }

}
