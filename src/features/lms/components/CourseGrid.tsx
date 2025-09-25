"use client";

import React from "react";
import { CourseCard } from "./CourseCard";
import { useCourses } from "../hooks/useCourses";
import styles from "./LMS.module.css";

interface CourseGridProps {
  featured?: boolean;
  limit?: number;
  category?: string;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ 
  featured = false, 
  limit,
  category 
}) => {
  const { courses, loading } = useCourses({ 
    featured, 
    limit, 
    category 
  });

  if (loading) {
    return (
      <div className={styles.courseGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`${styles.courseCard} ${styles.loading}`}>
            <div className={styles.skeleton}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.courseGrid}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};