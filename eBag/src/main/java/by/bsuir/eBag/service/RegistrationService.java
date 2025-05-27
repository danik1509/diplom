package by.bsuir.eBag.service;

import by.bsuir.eBag.model.Bucket;
import by.bsuir.eBag.model.User;
import by.bsuir.eBag.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow();
    }

    @Transactional
    public void register(User user) {
        Bucket bucket = new Bucket();
        bucket.setUser(user);
        bucket.setBucketId(user.getId());

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        user.setBucket(bucket);
        user.setRole("ROLE_USER");
        user.setImage("https://buyoncdn.ru/preset/401277851/pages_original/e4/39/a0/e439a01c3de88fab5bed0a257cc0b6dbfe3ed7a8.jpg");

        userRepository.save(user);
    }

}
