package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.CategoryEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper {
    CategoryEntity[] selectCategories();
}
