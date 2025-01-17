package com.bhs.sssss.mappers;

import com.bhs.sssss.entities.InquiryEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InquiryMapper {
    int insertInquiry(InquiryEntity inquiry);

    int countInquiries(); // 전체 문의 수 조회

    List<InquiryEntity> selectAllInquiries();

    List<InquiryEntity> selectInquiriesByPage(@Param("limitCount") int limitCount, @Param("offsetCount") int offsetCount); // 페이징된 문의 조회
}
