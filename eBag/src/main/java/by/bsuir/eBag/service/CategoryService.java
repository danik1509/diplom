package by.bsuir.eBag.service;

import by.bsuir.eBag.dto.CategoryDTO;
import by.bsuir.eBag.model.Category;
import by.bsuir.eBag.model.Product;
import by.bsuir.eBag.repository.CategoryRepository;
import by.bsuir.eBag.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(int id) {
        return categoryRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        return convertToDTO(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(int id, CategoryDTO categoryDTO) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(categoryDTO.getName());
                    return convertToDTO(categoryRepository.save(category));
                })
                .orElse(null);
    }

    public void deleteCategory(int id) {
        categoryRepository.findById(id).ifPresent(category -> {
            // Найти все продукты с этой категорией
            List<Product> products = productRepository.findByCategory(category);
            // Обнулить категорию у каждого продукта
            for (Product product : products) {
                product.setCategory(null);
            }
            productRepository.saveAll(products);
            // Удалить категорию
            categoryRepository.deleteById(id);
        });
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
} 