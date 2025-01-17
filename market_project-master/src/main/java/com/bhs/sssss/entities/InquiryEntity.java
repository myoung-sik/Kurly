package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(of = {"index"})
public class InquiryEntity {
    private int index; // Primary Key
    private String writer; // 작성자
    private String title; // 제목
    private String content; // 내용
    private String status; // 답변상태
    private LocalDateTime createdAt; // 생성일
    private LocalDateTime updatedAt; // 수정일
    private LocalDateTime deletedAt; // 삭제일
}
