"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Course } from "../types";
import { useCart } from "../hooks/useCart";
import { CourseContent } from "./CourseContent";
import { InstructorInfo } from "./InstructorInfo";
import { CourseReviews } from "./CourseReviews";
import styles from "./LMS.module.css";

interface CourseDetailProps {
  course: Course;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'content' | 'reviews'>('about');
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = () => {
    addToCart(course.id);
  };

  const handleBuyNow = () => {
    // Redirect to checkout
    window.location.href = `/authorized/lms/checkout?course=${course.id}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < Math.floor(rating) ? styles.starFull : styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.courseDetail}>
      {/* Course Hero Section */}
      <div className={styles.courseHero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.breadcrumb}>
              <span>Home</span> / <span>Courses</span> / <span>{course.category}</span>
            </div>
            
            <h1 className={styles.courseTitle}>{course.title}</h1>
            <p className={styles.courseDescription}>{course.description}</p>
            
            <div className={styles.courseRating}>
              <div className={styles.stars}>
                {renderStars(course.rating)}
              </div>
              <span className={styles.ratingText}>
                {course.rating} ({course.rating_count.toLocaleString()} ratings)
              </span>
            </div>

            <div className={styles.courseMeta}>
              <span>{course.students_enrolled.toLocaleString()} students enrolled</span>
              <span className={styles.separator}>•</span>
              <span>{course.languages.join(', ')}</span>
              <span className={styles.separator}>•</span>
              <span>Last updated {course.last_updated}</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.coursePreviewCard}>
              <div className={styles.previewImage}>
                <Image
                  src={course.image_url}
                  alt={course.title}
                  fill
                  className={styles.image}
                />
                <button className={styles.previewPlayBtn}>
                  ▶ Preview this course
                </button>
              </div>

              <div className={styles.previewContent}>
                <div className={styles.priceSection}>
                  <span className={styles.currentPrice}>${course.price}</span>
                  {course.original_price && course.original_price > course.price && (
                    <span className={styles.originalPrice}>${course.original_price}</span>
                  )}
                </div>

                <div className={styles.actionButtons}>
                  {isInCart(course.id) ? (
                    <button className={styles.goToCartBtn}>
                      Go to Cart
                    </button>
                  ) : (
                    <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                      Add to Cart
                    </button>
                  )}
                  
                  <button onClick={handleBuyNow} className={styles.buyNowBtn}>
                    Buy Now
                  </button>
                </div>

                <div className={styles.guarantee}>
                  30-Day Money Back Guarantee
                </div>

                <div className={styles.courseIncludes}>
                  <h4>This course includes:</h4>
                  <ul>
                    <li>📹 {course.duration} on-demand video</li>
                    <li>📄 {course.lectures_count} lectures</li>
                    <li>📱 Access on mobile and TV</li>
                    <li>🏆 Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Tabs */}
      <div className={styles.courseNavigation}>
        <div className={styles.navTabs}>
          <button 
            className={`${styles.navTab} ${activeTab === 'about' ? styles.active : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`${styles.navTab} ${activeTab === 'content' ? styles.active : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Course Content
          </button>
          <button 
            className={`${styles.navTab} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Instructor Info */}
      <InstructorInfo course={course} />

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'about' && (
          <div className={styles.aboutContent}>
            <div className={styles.section}>
              <h2>Requirements</h2>
              <ul>
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h2>What you&apos;ll learn</h2>
              <div className={styles.learningGrid}>
                {course.what_you_learn.map((item, index) => (
                  <div key={index} className={styles.learningItem}>
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Description</h2>
              <div className={styles.description}>
                <p>{course.description}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <CourseContent sections={course.sections} />
        )}

        {activeTab === 'reviews' && (
          <CourseReviews courseId={course.id} />
        )}
      </div>
    </div>
  );
};