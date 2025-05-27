package by.bsuir.eBag.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "bucket")
@Getter
@Setter
public class Bucket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bucket_id")
    private int bucketId;

    @OneToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "product_bucket", //название связующей таблицы
            joinColumns = @JoinColumn(name = "bucket_id"), //столбец bucket_id связывается с данным классом Bucket
            inverseJoinColumns = @JoinColumn(name = "product_id") // столбец product_id связывается с классом Product
    )
    private List<Product> products;

}
