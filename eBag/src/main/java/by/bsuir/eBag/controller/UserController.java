package by.bsuir.eBag.controller;


import by.bsuir.eBag.dto.UserDTO;
import by.bsuir.eBag.model.User;
import by.bsuir.eBag.service.UserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public UserController(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public UserDTO showUser(@PathVariable("id") int id) {
        User user = userService.findOne(id);
        return modelMapper.map(user, UserDTO.class);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<String> update(@RequestBody @Valid UserDTO userDTO,
                                         BindingResult bindingResult, @PathVariable int id) {
        if (bindingResult.hasErrors()) {
            String errorMessage = getErrorMessage(bindingResult);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        User user = modelMapper.map(userDTO, User.class);
        userService.update(id, user);
        return ResponseEntity.ok("User updated successfully.");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") int id) {
        userService.delete(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    private String getErrorMessage(BindingResult bindingResult) {
        List<String> errorMessages = bindingResult.getFieldErrors().stream()
                .map(error -> error.getField() + " -- " + error.getDefaultMessage())
                .collect(Collectors.toList());
        return String.join("; ", errorMessages);
    }
}
