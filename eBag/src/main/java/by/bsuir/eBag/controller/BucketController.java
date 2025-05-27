package by.bsuir.eBag.controller;

import by.bsuir.eBag.config.security.CustomUserDetails;
import by.bsuir.eBag.dto.BucketDTO;
import by.bsuir.eBag.service.BucketService;
import by.bsuir.eBag.util.ModelMapperUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bucket")
@CrossOrigin()
public class BucketController {

    private final BucketService bucketService;

    private final ModelMapper modelMapper;

    @Autowired
    public BucketController(BucketService bucketService, ModelMapper modelMapper) {
        this.bucketService = bucketService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/{id}")
    public BucketDTO getBucket(@PathVariable("id") int id) {
        return ModelMapperUtil.convertObject(bucketService.getBucketById(id), BucketDTO.class, modelMapper);
    }

    @PostMapping
    public ResponseEntity<HttpStatus> addToBucket(@AuthenticationPrincipal CustomUserDetails user, @RequestParam Integer id) {
        bucketService.addProductToBucket(user.getUser().getBucket().getBucketId(), id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<HttpStatus> removeFromBucket(@AuthenticationPrincipal CustomUserDetails user,
                                                       @RequestParam Integer id) {
        bucketService.removeProductFromBucket(user.getUser().getBucket().getBucketId(), id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
