package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.SubCategoryEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SubCategoryMapper {

    SubCategoryEntity[] selectSubCategoriesByParentId(@Param("parentId") String parentId);
}
