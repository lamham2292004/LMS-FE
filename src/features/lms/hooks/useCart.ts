"use client";

import { useState, useEffect } from "react";
import { CartItem } from "../types";

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

      // In real app, fetch course details from API
      // For now, mock the course data
      const mockCourse = {
        id: courseId,
        title: "Sample Course",
        description: "Sample description",
        image_url: "/placeholder-course.jpg",
        price: 15,
        original_price: 89.99,
        instructor_name: "Sample Instructor",
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
        created_at: "2024-01-01",
        updated_at: "2024-01-15",
        sections: [],
        requirements: [],
        what_you_learn: []
      };

      const newItem: CartItem = {
        id: Date.now(), // Generate unique ID
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
    total,
    originalTotal,
    savings
  };
};