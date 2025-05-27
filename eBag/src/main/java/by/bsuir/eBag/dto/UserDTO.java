package by.bsuir.eBag.dto;

import by.bsuir.eBag.model.Address;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {

    @NotEmpty(message = "Имя не должно быть пустым")
    @Size(min = 2)
    private String name;

    @Email
    @NotEmpty
    private String email;

    @NotEmpty
    private String username;


    private String password;

    private List<AddressDTO> addresses;

    private String image;

    private String role;

}
