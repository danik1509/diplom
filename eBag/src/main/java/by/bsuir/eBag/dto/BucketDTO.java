package by.bsuir.eBag.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BucketDTO {

    private int bucketId;

    private List<ProductDTO> products;

    private UserDTO user;

}
