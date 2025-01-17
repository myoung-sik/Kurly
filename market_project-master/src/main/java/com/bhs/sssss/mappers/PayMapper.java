package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.CartEntity;
import com.bhs.sssss.entities.PayLoadEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PayMapper {

    List<CartEntity> selectAllCarts(@Param("id") String id);

    List<PayLoadEntity> selectAllPayLoads(@Param("id") String id);

    int insertItemLoad(PayLoadEntity payLoadEntity);

    CartEntity selectCartById(int itemId, @Param("id") String id);

    List<Integer> getPayIndexByCartIndex(@Param("payItemId") int payItemId);

    void deleteCartItem(@Param("cartId") int cartId, @Param("itemId") String itemId);

}