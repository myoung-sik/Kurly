package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"index"})
public class ItemEntity {
    private int index;
    private String itemId;
    private String imageUrl;
    private String sticker;
    private String itemTitle;
    private String subTitle;
    private String discountRate;
    private String salesPrice;
    private String price;
    private String delivery;
    private String seller;
    private String packaging;
    private String detailImage;
    private String words;
    private String kurlyCheck;
    private String detailInfo;
    private Boolean isManual;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
