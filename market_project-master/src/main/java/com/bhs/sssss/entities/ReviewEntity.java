package com.bhs.sssss.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode(of = {"index"})
public class ReviewEntity {
    private int index;
    private String writer;
    private String title;
    private String content;
    private Integer imageIndex;
    private List<ImageEntity> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
