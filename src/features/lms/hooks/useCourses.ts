"use client";

import { useState, useEffect } from "react";
import { Course, CourseFilters } from "../types";
import { apiClient } from "@/lib/api";

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
        const params = new URLSearchParams();
        
        if (options.featured) params.append("featured", "true");
        if (options.limit) params.append("limit", options.limit.toString());
        if (options.category) params.append("category", options.category);
        
        const response = await apiClient.request<Course[]>(`/v1/lms/courses?${params.toString()}`);
        
        if (response.data) {
          setCourses(response.data);
        }
      } catch (err: any) {
        setError(err.message);
        // Mock data for development
        setCourses([
          {
            id: 1,
            title: "The Complete JavaScript Course 2024: Build Real Projects!",
            description: "The only course you need to learn web development - HTML, CSS, JS, Node, and More!",
            image_url: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
            price: 15,
            original_price: 89.99,
            discount_percentage: 83,
            instructor_name: "Jessica William",
            instructor_avatar: "/avatars/jessica.jpg",
            category: "Development",
            subcategory: "JavaScript",
            duration: "28 hours",
            lectures_count: 402,
            students_enrolled: 114521,
            rating: 4.5,
            rating_count: 81665,
            is_bestseller: true,
            level: "Beginner",
            languages: ["English", "Vietnamese"],
            last_updated: "1/2024",
            status: "published",
            created_at: "2024-01-01",
            updated_at: "2024-01-15",
            sections: [],
            requirements: [
              "Have a computer with Internet",
              "Be ready to learn an insane amount of awesome stuff",
              "Prepare to build real web apps!"
            ],
            what_you_learn: [
              "Build 16 beautiful real-world projects for your portfolio",
              "Master modern JavaScript from scratch",
              "Learn Node.js and Express.js",
              "Understand how JavaScript works behind the scenes",
              "Build modern and beautiful user interfaces",
              "Become job-ready by understanding how JavaScript really works"
            ]
          },
          {
            id: 2,
            title: "Beginning C++ Programming - From Beginner to Beyond",
            description: "Obtain Modern C++ skills from C++11 to C++17 as you build your foundation in C++ programming",
            image_url: "https://img-c.udemycdn.com/course/750x422/1576994_e54e_4.jpg",
            price: 13,
            original_price: 84.99,
            discount_percentage: 85,
            instructor_name: "Joginder Singh",
            instructor_avatar: "/avatars/joginder.jpg",
            category: "Development",
            subcategory: "C++",
            duration: "12 hours",
            lectures_count: 215,
            students_enrolled: 45230,
            rating: 4.3,
            rating_count: 18649,
            is_bestseller: true,
            level: "Beginner",
            languages: ["English"],
            last_updated: "18 days ago",
            status: "published",
            created_at: "2024-01-01",
            updated_at: "2024-01-15",
            sections: [],
            requirements: [
              "Access to a computer",
              "No programming experience needed",
              "Basic understanding of computers"
            ],
            what_you_learn: [
              "Learn to program with one of the most powerful programming languages",
              "Obtain the key concepts of programming that will also apply to other programming languages",
              "Learn Modern C++ rather than outdated C++ concepts",
              "Learn C++ features from basic to advanced"
            ]
          },
          {
            id: 3,
            title: "Complete Python Bootcamp: Go from zero to hero in Python 3",
            description: "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
            image_url: "https://img-c.udemycdn.com/course/750x422/629302_8a2d_2.jpg",
            price: 10,
            original_price: 74.99,
            discount_percentage: 87,
            instructor_name: "John Doe",
            instructor_avatar: "/avatars/john.jpg",
            category: "Development",
            subcategory: "Python",
            duration: "25 hours",
            lectures_count: 156,
            students_enrolled: 487239,
            rating: 4.6,
            rating_count: 165432,
            is_bestseller: true,
            level: "Beginner",
            languages: ["English", "Spanish"],
            last_updated: "15 days ago",
            status: "published",
            created_at: "2024-01-01",
            updated_at: "2024-01-15",
            sections: [
              {
                id: 1,
                title: "Introduction to this Course",
                lectures_count: 8,
                duration: "22:08",
                lectures: [
                  {
                    id: 1,
                    title: "A Note On Asking For Help",
                    type: "text",
                    duration: "00:12",
                    is_preview: false
                  },
                  {
                    id: 2,
                    title: "Introducing Our TA",
                    type: "video",
                    duration: "01:42",
                    is_preview: true
                  }
                ]
              }
            ],
            requirements: [
              "Just a computer with internet access",
              "Basic understanding of how to use a computer"
            ],
            what_you_learn: [
              "Learn to use Python professionally",
              "Create games with Python",
              "Learn advanced Python features",
              "Build GUIs and Desktop applications with Python"
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [options.featured, options.limit, options.category]);

  return { courses, loading, error };
};