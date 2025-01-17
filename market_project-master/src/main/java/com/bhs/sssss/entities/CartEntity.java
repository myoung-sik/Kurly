package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(of={"index"})
public class CartEntity {
    private int index; // 추가한 것
    private String memberId; // 추가한 것
    private int cartId; // 추가한 것
    private String itemId;
    private String itemName;
    private String costPrice;
    private int itemPrice;
    private String itemImage;
    private int quantity;
    private int isChecked;
    private boolean isDeleted;
    private String status;
}