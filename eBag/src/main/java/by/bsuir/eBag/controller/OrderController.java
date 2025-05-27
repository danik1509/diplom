package by.bsuir.eBag.controller;

import by.bsuir.eBag.config.security.CustomUserDetails;
import by.bsuir.eBag.dto.OrderDTO;
import by.bsuir.eBag.exception.ProductNotCreatedException;
import by.bsuir.eBag.model.Order;
import by.bsuir.eBag.service.OrderService;
import by.bsuir.eBag.util.ModelMapperUtil;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin()
public class OrderController {

    private final OrderService orderService;
    private final ModelMapper modelMapper;

    @Autowired
    public OrderController(OrderService orderService, ModelMapper modelMapper) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/orders")
    public List<OrderDTO> getAllOrders() {
        return orderService
                .findAllOrders()
                .stream()
                .map(order -> ModelMapperUtil.convertObject(order, OrderDTO.class, modelMapper))
                .collect(Collectors.toList());
    }

    @GetMapping("/order/{id}")
    public OrderDTO showOrder(@PathVariable("id") int id) {
        return ModelMapperUtil.convertObject(orderService.findOne(id), OrderDTO.class, modelMapper);
    }


    @PostMapping("/order")
    public OrderDTO createOrder(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody OrderDTO orderDTO) {
        return ModelMapperUtil.convertObject(
            orderService.createOrder(
                customUserDetails.getUser().getId(),
                orderDTO.getAddress().getId(),
                orderDTO.getDateOfDelivery()
            ),
            OrderDTO.class,
            modelMapper
        );
    }

    @PatchMapping("/order/{id}")
    public ResponseEntity<HttpStatus> update(@RequestBody @Valid OrderDTO orderDTO,
                                             BindingResult bindingResult, @PathVariable int id) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMessage
                        .append(error.getField())
                        .append(" -- ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }
            throw new ProductNotCreatedException(errorMessage.toString());
        }

        orderService.update(id, ModelMapperUtil.convertObject(orderDTO, Order.class, modelMapper));
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/order/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") int id) {
        orderService.delete(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
