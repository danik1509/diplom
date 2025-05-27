package by.bsuir.eBag.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressDTO {

    private int id;

    @NotEmpty
    private int apartmentNumber;

    @NotEmpty
    private int houseNumber;

    @NotEmpty
    private String street;

    @NotEmpty
    private int postCode;

}
