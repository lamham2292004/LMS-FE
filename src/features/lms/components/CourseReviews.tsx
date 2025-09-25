"use client";

import React, { useState } from "react";
import styles from "./LMS.module.css";

interface CourseReviewsProps {
  courseId: number;
}

interface Review {
  id: number;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      user_name: "John Smith",
      user_avatar: "/avatars/john.jpg",
      rating: 5,
      comment: "Excellent course! Very comprehensive and well-structured.",
      date: "2 weeks ago"
    },
    {
      id: 2,
      user_name: "Sarah Johnson",
      user_avatar: "/avatars/sarah.jpg", 
      rating: 4,
      comment: "Great content, but could use more practical examples.",
      date: "1 month ago"
    },
    {
      id: 3,
      user_name: "Mike Brown",
      user_avatar: "/avatars/mike.jpg",
      rating: 5,
      comment: "Perfect for beginners. Instructor explains everything clearly.",
      date: "6 weeks ago"
    }
  ]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <div className={styles.courseReviews}>
      <div className={styles.reviewsHeader}>
        <h2>Student Reviews</h2>
        <div className={styles.reviewsSummary}>
          <div className={styles.overallRating}>
            <span className={styles.ratingNumber}>4.6</span>
            <div className={styles.ratingStars}>
              {renderStars(5)}
            </div>
            <span className={styles.reviewCount}>
              Based on 1,234 reviews
            </span>
          </div>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerInfo}>
                <div className={styles.reviewerAvatar}>
                  <div className={styles.avatarPlaceholder}>
                    {review.user_name.charAt(0)}
                  </div>
                </div>
                <div className={styles.reviewerDetails}>
                  <h4>{review.user_name}</h4>
                  <span className={styles.reviewDate}>{review.date}</span>
                </div>
              </div>
              <div className={styles.reviewRating}>
                {renderStars(review.rating)}
              </div>
            </div>
            <p className={styles.reviewComment}>{review.comment}</p>
          </div>
        ))}
      </div>

      <div className={styles.reviewsFooter}>
        <button className={styles.loadMoreBtn}>
          Load More Reviews
        </button>
      </div>
    </div>
  );
};