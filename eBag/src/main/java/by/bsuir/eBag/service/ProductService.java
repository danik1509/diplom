package by.bsuir.eBag.service;

import by.bsuir.eBag.model.Product;
import by.bsuir.eBag.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product findOne(int id) {
        return productRepository.findById(id)
                .orElseThrow();
    }

    public void save(Product product) {
        product.setDateOfCreated(Calendar.getInstance().getTime());
        productRepository.save(product);
    }

    public void update(int id, Product updatedProduct) {//todo при обновлении меняется поле даты создания, придумать как исправить
        updatedProduct.setId(id);
        productRepository.save(updatedProduct);
    }

    public void delete(int id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

}
