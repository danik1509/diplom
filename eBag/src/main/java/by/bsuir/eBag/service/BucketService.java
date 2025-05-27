package by.bsuir.eBag.service;

import by.bsuir.eBag.model.Bucket;
import by.bsuir.eBag.repository.BucketRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Getter
@Setter
@Transactional
@RequiredArgsConstructor
public class BucketService {

    private final BucketRepository bucketRepository;

    private final ModelMapper modelMapper;

    private final ProductService productService;

    /*  private final OrderService orderService;*/

    @Transactional
    public void addProductToBucket(int bucketId, int id) {
        Bucket bucket = getById(bucketId);
        bucket.getProducts().add(productService.findOne(id));
        bucketRepository.save(bucket);
    }

    @Transactional
    public void removeProductFromBucket(int bucketId, Integer id) {
        Bucket bucket = getById(bucketId);
        bucket.getProducts().remove(productService.findOne(id));
        bucketRepository.save(bucket);
    }

    public Bucket getBucketById(int id) {
        Optional<Bucket> foundBucket = bucketRepository.findById(id);
        return foundBucket.orElseThrow(); //todo исключение создать
    }

    private Bucket getById(int bucketId) {
        return bucketRepository.findById(bucketId)
                .orElseThrow();
    }

}
