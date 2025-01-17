package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.ImageEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ImageMapper {
    int insertImage(ImageEntity image);

    ImageEntity selectImageByIndex(@Param("index") int index);
}
