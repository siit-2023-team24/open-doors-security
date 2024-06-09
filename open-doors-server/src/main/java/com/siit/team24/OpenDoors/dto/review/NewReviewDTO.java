package com.siit.team24.OpenDoors.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class NewReviewDTO {
    @Min(1)
    @Max(5)
    private int rating;
    private String comment;
    @Min(1)
    private String authorId;
    @Min(1)
    private String recipientId;

    public NewReviewDTO() {
    }

    public NewReviewDTO(int rating, String comment, String authorId, String recipientId) {
        this.rating = rating;
        this.comment = comment;
        this.authorId = authorId;
        this.recipientId = recipientId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }
}
