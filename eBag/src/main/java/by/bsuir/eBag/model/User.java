package by.bsuir.eBag.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Table(name = "users")
@Entity
@Getter
@Setter
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //todo : валидацию сделать на ФИО
    @NotEmpty(message = "Имя не должно быть пустым")
    @Column(name = "name")
    @Size(min = 2)
    private String name;

    @Email
    @NotEmpty
    @Column(name = "email")
    private String email;

    @Column(name = "password")
    @NotEmpty()
    private String password;

    @Column(name = "username")
    @NotEmpty
    private String username;

    @Column(name = "date_of_created")
    @Temporal(TemporalType.DATE)
    private Date dateOfCreated;

    @Column(name = "role")
    @NotEmpty
    private String role;

    @OneToMany(mappedBy = "owner")
    private List<Address> addresses;

    public User() {
    }

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Bucket bucket;

    @Column(name = "image")
    private String image;

}
