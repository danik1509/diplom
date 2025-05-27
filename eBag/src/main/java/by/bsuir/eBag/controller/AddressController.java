package by.bsuir.eBag.controller;

import by.bsuir.eBag.config.security.CustomUserDetails;
import by.bsuir.eBag.dto.AddressDTO;
import by.bsuir.eBag.exception.ProductNotCreatedException;
import by.bsuir.eBag.model.Address;
import by.bsuir.eBag.service.AddressService;
import by.bsuir.eBag.util.ModelMapperUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin()
public class AddressController {

    private final AddressService addressService;
    private final ModelMapper modelMapper;

    @GetMapping("/addresses")
    public List<AddressDTO> getAllAddresses() {
        return addressService.findAll()
                .stream()
                .map(address -> ModelMapperUtil.convertObject(address, AddressDTO.class, modelMapper))
                .toList();
    }

    @GetMapping("/address/{id}")
    public AddressDTO getAddressById(@PathVariable("id") Integer id) {
        Address address = addressService.findOne(id);
        return modelMapper.map(address, AddressDTO.class);
    }

    @PostMapping("/address")
    public ResponseEntity<Void> createAddress(@RequestBody @Valid AddressDTO addressDTO,
                                              @AuthenticationPrincipal CustomUserDetails customUserDetails,
                                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + " -- " + error.getDefaultMessage())
                    .collect(Collectors.joining("; "));
            throw new ProductNotCreatedException(errorMessage);
        }

        Address address = ModelMapperUtil.convertObject(addressDTO, Address.class, modelMapper);
        addressService.create(address, customUserDetails.getUser().getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/address/{id}")
    public ResponseEntity<Void> updateAddress(@RequestBody @Valid AddressDTO addressDTO,
                                              BindingResult bindingResult,
                                              @PathVariable Integer id) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + " -- " + error.getDefaultMessage())
                    .collect(Collectors.joining("; "));
            throw new ProductNotCreatedException(errorMessage);
        }

        Address address = ModelMapperUtil.convertObject(addressDTO, Address.class, modelMapper);
        addressService.update(id, address);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/address/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(@PathVariable("id") int id) {
        addressService.delete(id);
    }

}
