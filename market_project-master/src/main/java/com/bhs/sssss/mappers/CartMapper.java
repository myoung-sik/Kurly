package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.CartEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {
    List<CartEntity> selectCartsByMemberId(@Param("memberId") String memberId);

    List<CartEntity> selectAllCarts();

    CartEntity selectCartByIndex(@Param("index") int index);

    CartEntity selectCartByPrice(@Param("cartPrice")int cartPrice);

    int updateCart(CartEntity quantity);

    void updateCheckStatus(@Param("index") int index, @Param("isChecked") int isChecked);

    void deleteCartItem(@Param("index") int index);

    void updateDeletedStatusForItems(@Param("indices") List<Integer> indices);


    int countActiveItems(@Param("id") String id);

    int countCheckedItems(@Param("id") String id);

    int selectCountCartsByMemberId(@Param("memberId") String memberId);

    CartEntity selectCartByIdAndMemberId(@Param("itemId")int itemId,
                                         @Param("id") String id);


    int insertCart(CartEntity cart);

    int updateCartByQuantity(CartEntity cart);
}
