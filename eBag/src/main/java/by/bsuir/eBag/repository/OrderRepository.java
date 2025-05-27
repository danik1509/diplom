package by.bsuir.eBag.repository;

import by.bsuir.eBag.model.Order;
import by.bsuir.eBag.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT o FROM Order o JOIN o.productList p WHERE p = :product")
    List<Order> findOrdersByProduct(@Param("product") Product product);
}
