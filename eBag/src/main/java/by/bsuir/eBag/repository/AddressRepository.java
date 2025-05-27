package by.bsuir.eBag.repository;

import by.bsuir.eBag.model.Address;
import by.bsuir.eBag.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    Address findAddressByOwner(User owner);

}
