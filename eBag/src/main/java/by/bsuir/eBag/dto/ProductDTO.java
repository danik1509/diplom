package by.bsuir.eBag.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {

    private int id;

    @NotEmpty
    private String description;

    @NotEmpty
    @Min(value = 0, message = "цена должна быть выше 0")
    private double price;

    @NotEmpty
    private String tittle;

    @NotEmpty
    private int weight;

    private String image;

    private CategoryDTO category;
}
