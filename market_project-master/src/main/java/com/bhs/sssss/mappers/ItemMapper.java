package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.ItemEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItemMapper {

    ItemEntity selectItemByItemId(@Param("itemId") String itemId);

    ItemEntity[] selectItems();

    ItemEntity[] selectItemsByNew(@Param("limitCount") int limitCount,
                                  @Param("offsetCount") int offsetCount);

    ItemEntity[] selectItemsBySticker(@Param("limitCount") int limitCount,
                                      @Param("offsetCount") int offsetCount);

    ItemEntity[] selectItemsByDiscount(@Param("limitCount") int limitCount,
                                       @Param("offsetCount") int offsetCount);

    ItemEntity[] selectItemsByKeyword(@Param("keyword") String keyword,
                                      @Param("limitCount") int limitCount,
                                      @Param("offsetCount") int offsetCount);

    int selectItemCount();

    int selectItemCount1();

    int selectItemCount2();

    int selectItemCountByKeyword(@Param("keyword") String keyword);


    int insertItem(ItemEntity itemEntity);

    ItemEntity selectItemByIndex(int index);

    List<ItemEntity> selectAllItems();

    int updateItem(ItemEntity item);

    int deleteItem(int index);

    ItemEntity getItemByItemId(@Param("itemId") String itemId);
}
