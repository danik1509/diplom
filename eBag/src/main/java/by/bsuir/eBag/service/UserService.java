package by.bsuir.eBag.service;

import by.bsuir.eBag.model.User;
import by.bsuir.eBag.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findOne(int id) {
        return userRepository.findById(id)
                .orElseThrow();
    }

    public void save(User user) {
        user.setDateOfCreated(Calendar.getInstance().getTime());
        userRepository.save(user);
    }

    public void update(int id, User updateduser) {
        updateduser.setId(id);
        userRepository.save(updateduser);
    }

    public void delete(int id) {
        userRepository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
