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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Order {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "date_of_created")
    @Temporal(TemporalType.DATE)
    private Date dateOfCreated;

    @Column(name = "date_of_delivery")
    @Temporal(TemporalType.DATE)
    private Date dateOfDelivery;

    @Column(name = "status")
    private String status;

    @Column(name = "sum")
    private double sum;

    @OneToOne
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "order_product", //название связующей таблицы
            joinColumns = @JoinColumn(name = "order_id"), //столбец order_id связывается с данным классом Order
            inverseJoinColumns = @JoinColumn(name = "id_product") // столбец product_id связывается с классом Product
    )
    private List<Product> productList;

    public Order() {
    }
}
