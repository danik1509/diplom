package by.bsuir.eBag.util;

import org.modelmapper.ModelMapper;

public final class ModelMapperUtil {

    private ModelMapperUtil() {
    }

    public static <T, U> U convertObject(T source, Class<U> targetClass, ModelMapper modelMapper) {
        return modelMapper.map(source, targetClass);
    }

}
