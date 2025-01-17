package com.bhs.sssss.services;

import com.bhs.sssss.entities.ImageEntity;
import com.bhs.sssss.entities.ReviewEntity;
import com.bhs.sssss.mappers.ImageMapper;
import com.bhs.sssss.mappers.ReviewMapper;
import com.bhs.sssss.results.CommonResult;
import com.bhs.sssss.results.Result;
import com.bhs.sssss.vos.PageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewMapper reviewMapper;
    private final ImageMapper imageMapper;

    @Autowired
    public ReviewService(ReviewMapper reviewMapper, ImageMapper imageMapper) {
        this.reviewMapper = reviewMapper;
        this.imageMapper = imageMapper;
    }

    public Result write(ReviewEntity review, MultipartFile imageFile) throws IOException {
        if (review == null || review.getWriter() == null || review.getWriter().isEmpty() || review.getWriter().length() > 5 ||
                review.getTitle() == null || review.getTitle().isEmpty() || review.getTitle().length() > 50 ||
                review.getContent() == null || review.getContent().isEmpty() || review.getContent().length() < 2 || review.getContent().length() > 500) {
            return CommonResult.FAILURE;
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            ImageEntity image = new ImageEntity();
            image.setData(imageFile.getBytes());
            image.setContentType(imageFile.getContentType());
            image.setName(imageFile.getOriginalFilename());
            image.setCreatedAt(LocalDateTime.now());

            int imageInsertResult = this.imageMapper.insertImage(image);
            if (imageInsertResult > 0) {
                review.setImageIndex(image.getIndex());
            } else {
                return CommonResult.FAILURE;
            }
        }

        review.setCreatedAt(LocalDateTime.now());
        int insertResult = this.reviewMapper.insertReview(review);
        return insertResult > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }

    public List<ReviewEntity> getAllReviews() {
        return this.reviewMapper.selectAllReviews();
    }

    public ImageEntity getImage(int index) {
        if (index < 1) {
            return null;
        }
        return this.imageMapper.selectImageByIndex(index);
    }

    public boolean uploadImage(ImageEntity image) {
        if (image == null ||
                image.getData() == null ||
                image.getData().length == 0 ||
                image.getContentType() == null || image.getContentType().isEmpty() ||
                image.getName() == null || image.getName().isEmpty()) {
            return false;
        }
        image.setCreatedAt(LocalDateTime.now());
        return this.imageMapper.insertImage(image) > 0;
    }

    public Pair<PageVo, List<ReviewEntity>> getReviewsByPage(int page) {
        int totalCount = this.reviewMapper.countReviews();
        PageVo pageVo = new PageVo(page, totalCount);

        List<ReviewEntity> reviews = this.reviewMapper.selectReviewsByPage(
                pageVo.countPerPage,
                pageVo.offsetCount);

        return Pair.of(pageVo, reviews);
    }

    public int getTotalReviewCount() {
        return this.reviewMapper.countReviews();
    }

    public CommonResult modifyReview(ReviewEntity review, MultipartFile image) throws IOException {
        if (review == null || review.getIndex() < 1 || review.getTitle() == null || review.getContent() == null) {
            return CommonResult.FAILURE;
        }

        ReviewEntity dbReview = reviewMapper.selectReviewByIndex(review.getIndex());
        if (dbReview == null || dbReview.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }

        dbReview.setTitle(review.getTitle());
        dbReview.setContent(review.getContent());

        if (image != null && !image.isEmpty()) {
            ImageEntity newImage = new ImageEntity();
            newImage.setData(image.getBytes());
            newImage.setContentType(image.getContentType());
            newImage.setName(image.getOriginalFilename());
            imageMapper.insertImage(newImage);
            dbReview.setImageIndex(newImage.getIndex());
        }

        dbReview.setUpdatedAt(LocalDateTime.now());
        return reviewMapper.updateReview(dbReview) > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }

    public CommonResult deleteReview(int index) {
        if (index < 1) {
            return CommonResult.FAILURE;
        }

        ReviewEntity review = reviewMapper.selectReviewByIndex(index);
        if (review == null || review.getDeletedAt() != null) {
            return CommonResult.FAILURE;
        }

        return reviewMapper.deleteReview(index) > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }

    public ReviewEntity getReviewByIndex(int index) {
        return reviewMapper.selectReviewByIndex(index);
    }
}
