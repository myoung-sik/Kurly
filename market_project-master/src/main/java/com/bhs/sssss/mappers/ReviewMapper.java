package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.ReviewEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Mapper
public interface ReviewMapper {
    int insertReview(ReviewEntity review);

    int countReviews(); // 전체 문의 수 조회

    List<ReviewEntity> selectReviewsByPage(@Param("limitCount") int limitCount, @Param("offsetCount") int offsetCount); // 페이징된 문의 조회

    int updateReview(ReviewEntity dbReview);

    int deleteReview(int index);

    ReviewEntity selectReviewByIndex(@Param("index") int index);

    int countReviewsByItemId(@Param("itemId") String itemId);

    List<ReviewEntity> selectReviewsByItemId(@Param("itemId") String itemId, @Param("limitCount") int limitCount, @Param("offsetCount") int offsetCount);
}
