package by.bsuir.eBag.service;

import by.bsuir.eBag.model.Bucket;
import by.bsuir.eBag.repository.BucketRepository;
import by.bsuir.eBag.repository.OrderRepository;
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
    private final OrderRepository orderRepository;

    /*  private final OrderService orderService;*/

    @Transactional
    public void addProductToBucket(int bucketId, int id) {
        Bucket bucket = getById(bucketId);
        var product = productService.findOne(id);
        
        // Если товар уже есть в корзине, увеличиваем его количество
        if (bucket.getProducts().contains(product)) {
            // Увеличиваем количество товара
            bucket.getProducts().add(product);
        } else {
            // Если товара нет, добавляем его
            bucket.getProducts().add(product);
        }
        
        bucketRepository.save(bucket);
    }

    @Transactional
    public void removeProductFromBucket(int bucketId, Integer id) {
        Bucket bucket = getById(bucketId);
        var product = productService.findOne(id);

        // Удаляем один экземпляр товара
        bucket.getProducts().remove(product);
        bucketRepository.save(bucket);
    }

    @Transactional
    public void clearBucketAfterOrder(int bucketId) {
        Bucket bucket = getById(bucketId);
        bucket.getProducts().clear();
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
