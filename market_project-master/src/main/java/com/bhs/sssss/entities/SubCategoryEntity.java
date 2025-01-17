package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = "subCategoryId")
public class SubCategoryEntity {
    private String subCategoryId;
    private String parentId;
    private String subCategoryName;

}
