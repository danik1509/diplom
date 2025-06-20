package by.bsuir.eBag.repository;

import by.bsuir.eBag.model.Product;
import by.bsuir.eBag.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategory(Category category);
}
