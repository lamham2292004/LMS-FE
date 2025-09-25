"use client";

import React from "react";
import Image from "next/image";
import { Course } from "../types";
import styles from "./LMS.module.css";

interface InstructorInfoProps {
  course: Course;
}

export const InstructorInfo: React.FC<InstructorInfoProps> = ({ course }) => {
  return (
    <div className={styles.instructorInfo}>
      <div className={styles.instructorCard}>
        <div className={styles.instructorHeader}>
          <div className={styles.instructorAvatar}>
            <Image
              src={course.instructor_avatar}
              alt={course.instructor_name}
              fill
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.instructorDetails}>
            <h3>{course.instructor_name}</h3>
            <p>Professional Instructor</p>
            <div className={styles.instructorStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1452</span>
                <span className={styles.statLabel}>Students</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100</span>
                <span className={styles.statLabel}>Reviews</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>20</span>
                <span className={styles.statLabel}>Courses</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>9</span>
                <span className={styles.statLabel}>Years</span>
              </div>
            </div>
          </div>
          <div className={styles.subscribeSection}>
            <button className={styles.subscribeBtn}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};