package by.bsuir.eBag.service;

import by.bsuir.eBag.model.Address;
import by.bsuir.eBag.model.User;
import by.bsuir.eBag.repository.AddressRepository;
import by.bsuir.eBag.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public Address findOne(int id) {
        return addressRepository.findById(id)
                .orElseThrow();
    }

    public void save(Address address) {
        addressRepository.save(address);
    }

    @Transactional
    public void create(Address address, int userId) {
        address.setOwner(userRepository.findById(userId).orElseThrow());
        addressRepository.save(address);
        log.info("Create address with user id {}", userId);
    }

    @Transactional
    public void update(int id, Address updatedAddress) {
        updatedAddress.setId(id);
        addressRepository.save(updatedAddress);
    }

    public void delete(int id) {
        addressRepository.deleteById(id);
    }

    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    public Address findByUser(User owner) {
        return addressRepository.findAddressByOwner(owner);
    }

}
