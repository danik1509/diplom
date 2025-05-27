package by.bsuir.eBag.service;

import by.bsuir.eBag.model.Address;
import by.bsuir.eBag.model.Order;
import by.bsuir.eBag.model.Product;
import by.bsuir.eBag.model.User;
import by.bsuir.eBag.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final AddressService addressService;

    public Order findOne(int id) {
        return orderRepository.findById(id)
                .orElseThrow();
    }

    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    public void save(Order order) {
        orderRepository.save(order);
    }

    public void update(int id, Order updatedOrder) {
        updatedOrder.setId(id);
        orderRepository.save(updatedOrder);
    }

    public void delete(int id) {
        orderRepository.deleteById(id);
    }

    public Order createOrder(int userid, Date date) {
        User user = userService.findOne(userid);
        Address address = addressService.findByUser(user);

        List<Product> bucketProductList = user.getBucket().getProducts();
        List<Product> productList = new ArrayList<>(bucketProductList);

        double sum = calculateOrderSum(productList);
        return orderRepository.save(
                Order.builder()
                        .dateOfCreated(Calendar.getInstance().getTime())
                        .user(user)
                        .address(address)
                        .productList(productList)
                        .status("in Process")
                        .sum(sum)
                        .dateOfDelivery(date)
                        .build()
        );
    }

    private double calculateOrderSum(List<Product> productList) {
        double sum = 0.0;
        for (Product product : productList) {
            sum += product.getPrice();
        }
        return sum;
    }

}
