"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "../types";
import { useCart } from "../hooks/useCart";
import styles from "./LMS.module.css";

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { addToCart, isInCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(course.id);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.starFull}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={styles.starHalf}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
      }
    }
    return stars;
  };

  return (
    <div 
      className={styles.courseCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/authorized/lms/courses/${course.id}`}>
        <div className={styles.courseImage}>
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            className={styles.image}
          />
          
          {course.is_bestseller && (
            <div className={styles.bestsellerBadge}>BESTSELLER</div>
          )}
          
          <div className={styles.courseDuration}>{course.duration}</div>
          
          {isHovered && (
            <div className={styles.coursePreview}>
              <button className={styles.previewBtn}>
                Preview this course
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className={styles.courseContent}>
        <div className={styles.courseCategory}>
          {course.category} | {course.subcategory}
        </div>
        
        <Link href={`/authorized/lms/courses/${course.id}`}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
        </Link>
        
        <p className={styles.courseDescription}>
          {course.description.length > 100 
            ? `${course.description.substring(0, 100)}...`
            : course.description
          }
        </p>

        <div className={styles.courseInstructor}>
          By <strong>{course.instructor_name}</strong>
        </div>

        <div className={styles.courseRating}>
          <div className={styles.stars}>
            {renderStars(course.rating)}
          </div>
          <span className={styles.ratingNumber}>
            {course.rating} ({course.rating_count.toLocaleString()} ratings)
          </span>
        </div>

        <div className={styles.courseStats}>
          <span>{course.students_enrolled.toLocaleString()} students enrolled</span>
        </div>

        <div className={styles.courseFooter}>
          <div className={styles.coursePrice}>
            <span className={styles.currentPrice}>${course.price}</span>
            {course.original_price && course.original_price > course.price && (
              <span className={styles.originalPrice}>${course.original_price}</span>
            )}
          </div>

          <div className={styles.courseActions}>
            {isInCart(course.id) ? (
              <Link href="/authorized/lms/cart" className={styles.goToCartBtn}>
                Go to Cart
              </Link>
            ) : (
              <button 
                onClick={handleAddToCart}
                className={styles.addToCartBtn}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
