package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.ReviewEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewMapper {
    int insertReview(ReviewEntity review);

    List<ReviewEntity> selectAllReviews();

    int countReviews(); // 전체 문의 수 조회

    List<ReviewEntity> selectReviewsByPage(@Param("limitCount") int limitCount, @Param("offsetCount") int offsetCount); // 페이징된 문의 조회

    int updateReview(ReviewEntity review);

    int deleteReview(int index);

    ReviewEntity selectReviewByIndex(int index);
}
