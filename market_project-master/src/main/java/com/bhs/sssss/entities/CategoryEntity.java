package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of = {"categoryId"})
public class CategoryEntity {
    private String categoryId;
    private String categoryName;
    private String categoryImg;
}
