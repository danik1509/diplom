package by.bsuir.eBag.dto;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderDTO {

    private int id;

    @Temporal(TemporalType.DATE)
    private Date dateOfDelivery;

    @NotEmpty
    private String status;

    @NotEmpty
    private double sum;

    private UserDTO user;

    private AddressDTO address;

    private List<ProductDTO> productList;

}
