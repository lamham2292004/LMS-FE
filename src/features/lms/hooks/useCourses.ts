// src/features/lms/hooks/useCourses.ts
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

// Updated Course interface to match backend response
export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  teacherId: number;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  categoryName?: string;
  img?: string;
  lessons?: any[];
  enrollments?: any[];
  // Computed fields for UI compatibility
  image_url: string;
  original_price?: number;
  discount_percentage?: number;
  instructor_name: string;
  instructor_avatar: string;
  category: string;
  subcategory?: string;
  duration: string;
  lectures_count: number;
  students_enrolled: number;
  rating: number;
  rating_count: number;
  is_bestseller: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  languages: string[];
  last_updated: string;
  sections: any[];
  requirements: string[];
  what_you_learn: string[];
}

interface CourseFilters {
  featured?: boolean;
  limit?: number;
  category?: string;
  search?: string;
}

interface UseCoursesOptions {
  featured?: boolean;
  limit?: number;
  category?: string;
  filters?: CourseFilters;
}

export const useCourses = (options: UseCoursesOptions = {}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.getCourses();
        
        if (response.result) {
          // Transform backend data to match frontend interface
          const transformedCourses = response.result.map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description || '',
            price: course.price || 0,
            teacherId: course.teacherId,
            status: course.status,
            startTime: course.startTime,
            endTime: course.endTime,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            categoryId: course.categoryId,
            categoryName: course.categoryName || 'General',
            img: course.img,
            lessons: course.lessons || [],
            enrollments: course.enrollments || [],
            // UI compatibility fields
            image_url: course.img ? `http://localhost:8083${course.img}` : '/placeholder-course.jpg',
            original_price: course.price ? course.price * 1.5 : undefined, // Mock original price
            discount_percentage: course.price ? Math.floor(Math.random() * 30) + 10 : undefined,
            instructor_name: 'Instructor Name', // TODO: Get from user service
            instructor_avatar: '/placeholder-avatar.jpg',
            category: course.categoryName || 'Development',
            subcategory: 'Programming',
            duration: `${Math.floor(Math.random() * 30) + 10} hours`, // Mock duration
            lectures_count: course.lessons?.length || Math.floor(Math.random() * 50) + 20,
            students_enrolled: Math.floor(Math.random() * 1000) + 100,
            rating: parseFloat((4 + Math.random()).toFixed(1)),
            rating_count: Math.floor(Math.random() * 10000) + 100,
            is_bestseller: Math.random() > 0.7,
            level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as any,
            languages: ['English'],
            last_updated: new Date(course.updatedAt).toLocaleDateString(),
            sections: [],
            requirements: [
              'Basic computer skills',
              'Internet connection',
              'Willingness to learn'
            ],
            what_you_learn: [
              'Master the fundamentals',
              'Build real projects',
              'Advanced techniques',
              'Best practices'
            ]
          }));

          // Apply filters
          let filteredCourses = transformedCourses;

          if (options.category) {
            filteredCourses = filteredCourses.filter(course => 
              course.category.toLowerCase().includes(options.category!.toLowerCase())
            );
          }

          if (options.featured) {
            filteredCourses = filteredCourses.filter(course => course.is_bestseller);
          }

          if (options.limit) {
            filteredCourses = filteredCourses.slice(0, options.limit);
          }

          setCourses(filteredCourses);
        }
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message);
        
        // Fallback to empty array or show error message
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [options.featured, options.limit, options.category]);

  return { courses, loading, error };
};