package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"index"})
public class PayLoadEntity {
    private int index;
    private int cartIndex;
    private String memberId;
    private int payItemId;
    private String payItemName;
    private String payItemPrice;
    private String payQuantity;
    private String itemImage;
    private int totalPrice;
    private LocalDateTime purchaseDay;
}