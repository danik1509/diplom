package by.bsuir.eBag.controller;

import by.bsuir.eBag.dto.ProductDTO;
import by.bsuir.eBag.exception.ProductNotCreatedException;
import by.bsuir.eBag.model.Product;
import by.bsuir.eBag.service.ProductService;
import by.bsuir.eBag.util.ModelMapperUtil;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class
ProductController {

    private final ProductService productService;

    private final ModelMapper modelMapper;

    @Autowired
    public ProductController(ProductService productService, ModelMapper modelMapper) {
        this.productService = productService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return productService
                .getAllProducts()
                .stream()
                .map(product -> ModelMapperUtil.
                        convertObject(product, ProductDTO.class, modelMapper))
                .collect(Collectors.toList());
    }

    @GetMapping("/product/{id}")
    public ProductDTO showProduct(@PathVariable("id") int id) {
        return ModelMapperUtil.convertObject(productService.findOne(id), ProductDTO.class, modelMapper);
    }

    @PostMapping("/product")
    public ResponseEntity<HttpStatus> create(@RequestBody @Valid ProductDTO productDTO,
                                             BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + " -- " + error.getDefaultMessage())
                    .collect(Collectors.joining("; "));
            throw new ProductNotCreatedException(errorMessage);
        }
        productService.save(ModelMapperUtil.convertObject(productDTO, Product.class, modelMapper));
        //Отправляем http ответ с пустым телом и со статусом 200
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/product/{id}")
    public ResponseEntity<HttpStatus> update(@RequestBody @Valid ProductDTO productDTO,
                                             BindingResult bindingResult, @PathVariable int id) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + " -- " + error.getDefaultMessage())
                    .collect(Collectors.joining("; "));
            throw new ProductNotCreatedException(errorMessage);
        }

        productService.update(id, ModelMapperUtil.convertObject(productDTO, Product.class, modelMapper));
        //Отправляем http ответ с пустым телом и со статусом 200
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") int id) {
        productService.delete(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
