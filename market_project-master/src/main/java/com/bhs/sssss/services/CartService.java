package com.bhs.sssss.services;

import com.bhs.sssss.entities.CartEntity;
import com.bhs.sssss.entities.ItemEntity;
import com.bhs.sssss.entities.MemberEntity;
import com.bhs.sssss.exceptions.TransactionalException;
import com.bhs.sssss.mappers.CartMapper;
import com.bhs.sssss.mappers.ItemMapper;
import com.bhs.sssss.mappers.MemberMapper;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {
    private final CartMapper cartMapper;
    private final MemberMapper memberMapper;
    private final ItemMapper itemMapper;

    @Autowired
    public CartService(CartMapper cartMapper, MemberMapper memberMapper, ItemMapper itemMapper) {
        this.cartMapper = cartMapper;
        this.memberMapper = memberMapper;
        this.itemMapper = itemMapper;
    }


    public List<CartEntity> getCartsByMemberId(String memberId) {
        return this.cartMapper.selectCartsByMemberId(memberId);
    }

    public int getCartsCountByMemberId(String memberId) {
        return this.cartMapper.selectCountCartsByMemberId(memberId);
    }

    public List<CartEntity> getAllCarts() {
        return cartMapper.selectAllCarts();
    }



    public int plus(CartEntity cart, int quantity, int index) throws IllegalArgumentException {
        final int Max_Quantity = 50;
        if (quantity < 1 || cart.getQuantity() >= Max_Quantity) {
            return cart.getQuantity();
        }


        CartEntity cartItem = this.cartMapper.selectCartByIndex(index);
        if (cartItem == null) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }

        int newQuantity = cartItem.getQuantity() + 1;
        if (newQuantity > Max_Quantity) {
            newQuantity = Max_Quantity;
        }

        cartItem.setQuantity(newQuantity);
        this.cartMapper.updateCart(cartItem);

        return newQuantity;
    }

    public int minus(int quantity, int index) throws IllegalArgumentException {
        final int Min_Quantity = 1;

        CartEntity cartItem = this.cartMapper.selectCartByIndex(index);
        if (cartItem == null) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }

        if (quantity < 1 || cartItem.getQuantity() <= Min_Quantity) {
            return cartItem.getQuantity();  // 수량이 이미 최소값이면 그대로 반환
        }

        int newQuantity = cartItem.getQuantity() - 1;
        if (newQuantity < Min_Quantity) {
            newQuantity = Min_Quantity; // 최소 수량으로 제한
        }

        cartItem.setQuantity(newQuantity);
        this.cartMapper.updateCart(cartItem);

        return newQuantity;
    }


    public void updateCheckStatus(int index, int isChecked) {
        if (index <= 0) {
            throw new IllegalArgumentException("Invalid index: " + index); // index 유효성 검사
        }
        this.cartMapper.updateCheckStatus(index, isChecked);
    }

    public int calculateTotalPrice(List<Integer> indices, List<Integer> itemPrices) {
        if (indices == null || itemPrices == null || indices.size() != itemPrices.size()) {
            throw new IllegalArgumentException("Invalid input data: itemIds or itemPrices is null or mismatched");
        }

        int totalPrice = 0;
        for (int i = 0; i < indices.size(); i++) {
            totalPrice += itemPrices.get(i); // itemPrice 합산
        }
        return totalPrice;
    }


    public void deleteItem(int index) {
        CartEntity cartItem = this.cartMapper.selectCartByIndex(index);
        if (index <= 0) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }

        this.cartMapper.deleteCartItem(index);
    }

    public void deleteSelectedItems(List<Integer> indices) {
        if (indices == null || indices.isEmpty()) {
            throw new IllegalArgumentException("Index list is empty");
        }
        this.cartMapper.updateDeletedStatusForItems(indices);
    }


    public boolean hasActiveItems(MemberEntity member) {
        return cartMapper.countActiveItems(member.getId()) > 0;
    }

    public boolean hasCheckedItems(MemberEntity member) {
        return cartMapper.countCheckedItems(member.getId()) > 0;
    }

    @Transactional
    public Result postCart(MemberEntity member, int quantity, String itemId){
        if(member == null || itemId == null) {
            return CommonResult.FAILURE;
        }
        if(quantity <= 0) {
            quantity = 1;
        }
        if(this.cartMapper.selectCartByIdAndMemberId(Integer.parseInt(itemId), member.getId()) != null) {
            CartEntity cart = this.cartMapper.selectCartByIdAndMemberId(Integer.parseInt(itemId), member.getId());
            cart.setQuantity(cart.getQuantity() + quantity);
            if(this.cartMapper.updateCartByQuantity(cart) == 0) {
                throw new TransactionalException();
            }
        } else {
            ItemEntity item = this.itemMapper.selectItemByItemId(itemId);
            int price = Integer.parseInt(item.getSalesPrice().replaceAll(",", ""));
            MemberEntity dbMember = this.memberMapper.selectUserById(member.getId());

            CartEntity cartItem = new CartEntity();
            cartItem.setMemberId(dbMember.getId());
            cartItem.setCartId(dbMember.getCartId());
            cartItem.setItemId(item.getItemId());
            cartItem.setItemName(item.getItemTitle());
            if(item.getPrice() != null || !item.getPrice().isEmpty()){
                cartItem.setCostPrice(item.getPrice());
            } else {
                cartItem.setCostPrice(null);
            }
            cartItem.setItemPrice(price);
            cartItem.setQuantity(quantity);
            cartItem.setIsChecked(1);
            cartItem.setDeleted(false);
            cartItem.setStatus(item.getPackaging());
            cartItem.setItemImage(item.getImageUrl());

            if(this.cartMapper.insertCart(cartItem) == 0) {
                throw new TransactionalException();
            }
        }

        return CommonResult.SUCCESS;
    }

}
