package com.growgenie.controller;

import com.growgenie.model.Product;
import com.growgenie.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(Map.of("status", "success", "data", products));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        productRepository.save(product);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Product created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Product deleted successfully"));
    }
}
