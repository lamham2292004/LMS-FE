// src/features/lms/hooks/useCart.ts
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export interface CartItem {
  id: number;
  course_id: number;
  course: any; // Use Course interface
  added_at: string;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lms_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("lms_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = async (courseId: number) => {
    try {
      setLoading(true);
      
      // Check if item already in cart
      const existingItem = items.find(item => item.course_id === courseId);
      if (existingItem) {
        console.log("Course already in cart");
        return;
      }

      // Fetch course details from LMS API
      const response = await apiClient.getCourseById(courseId);
      
      if (response.result) {
        const course = response.result;
        
        // Transform to match UI expectations
        const transformedCourse = {
          id: course.id,
          title: course.title,
          description: course.description || '',
          image_url: course.img ? `http://localhost:8083${course.img}` : '/placeholder-course.jpg',
          price: course.price || 0,
          original_price: course.price ? course.price * 1.5 : undefined,
          instructor_name: 'Instructor Name', // TODO: Get from user service
          instructor_avatar: '/placeholder-avatar.jpg',
          category: course.categoryName || 'Development',
          duration: '10 hours', // Mock duration
          lectures_count: 50,
          students_enrolled: 1000,
          rating: 4.5,
          rating_count: 100,
          is_bestseller: false,
          level: "Beginner" as const,
          languages: ["English"],
          last_updated: "1/2024",
          status: "published" as const,
          created_at: course.createdAt,
          updated_at: course.updatedAt,
          sections: [],
          requirements: [],
          what_you_learn: []
        };

        const newItem: CartItem = {
          id: Date.now(), // Generate unique ID
          course_id: courseId,
          course: transformedCourse,
          added_at: new Date().toISOString()
        };

        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Still add to cart with mock data as fallback
      const mockCourse = {
        id: courseId,
        title: "Course Title",
        description: "Course description",
        image_url: "/placeholder-course.jpg",
        price: 15,
        original_price: 89.99,
        instructor_name: "Instructor",
        instructor_avatar: "/placeholder-avatar.jpg",
        category: "Development",
        duration: "10 hours",
        lectures_count: 50,
        students_enrolled: 1000,
        rating: 4.5,
        rating_count: 100,
        is_bestseller: false,
        level: "Beginner" as const,
        languages: ["English"],
        last_updated: "1/2024",
        status: "published" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: [],
        requirements: [],
        what_you_learn: []
      };

      const newItem: CartItem = {
        id: Date.now(),
        course_id: courseId,
        course: mockCourse,
        added_at: new Date().toISOString()
      };

      setItems(prev => [...prev, newItem]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (itemId: number) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: number) => {
    return items.some(item => item.course_id === courseId);
  };

  // Enroll in course (checkout process)
  const enrollCourse = async (courseId: number) => {
    try {
      setLoading(true);
      
      // Call enrollment API
      const response = await apiClient.enrollCourse(courseId);
      
      if (response.result) {
        // Remove from cart after successful enrollment
        setItems(prev => prev.filter(item => item.course_id !== courseId));
        return response.result;
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkoutAll = async () => {
    try {
      setLoading(true);
      
      // Enroll in all courses in cart
      const enrollmentPromises = items.map(item => enrollCourse(item.course_id));
      await Promise.all(enrollmentPromises);
      
      // Clear cart after successful checkout
      clearCart();
      
      return true;
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const total = items.reduce((sum, item) => sum + item.course.price, 0);
  const originalTotal = items.reduce((sum, item) => 
    sum + (item.course.original_price || item.course.price), 0);
  const savings = originalTotal - total;

  return {
    items,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    enrollCourse,
    checkoutAll,
    total,
    originalTotal,
    savings
  };