package by.bsuir.eBag.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "product")
@Getter
@Setter
public class Product {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "date_of_created")
    @NotEmpty
    private Date dateOfCreated;

    @NotEmpty
    @Column(name = "description")
    private String description;

    @NotEmpty
    @Min(value = 0, message = "цена должна быть выше 0")
    @Column(name = "price")
    private double price;

    @NotEmpty
    @Column(name = "tittle")
    private String tittle;

    @NotEmpty
    @Column(name = "weight")
    private int weight;

    @Column(name = "image")
    private String image;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
