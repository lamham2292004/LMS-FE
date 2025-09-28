// src/app/authorized/lms/courses/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/features/auth";
import { CourseGrid } from "@/features/lms/components/CourseGrid";
import { useCourses } from "@/features/lms/hooks/useCourses";
import { apiClient } from "@/lib/api";
import styles from "@/features/lms/components/LMS.module.css";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  const { courses, loading, error } = useCourses({
    category: selectedCategory,
    filters: {
      search: searchTerm,
      price: priceFilter as any,
      sort_by: sortBy as any
    }
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response.result) {
        setCategories(response.result);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be handled by the hook
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesPrice = priceFilter === "all" ||
      (priceFilter === "free" && course.price === 0) ||
      (priceFilter === "paid" && course.price > 0);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.students_enrolled - a.students_enrolled;
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <ProtectedRoute>
      <div className={styles.lmsDashboard}>
        <main className={styles.main}>
          <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerSection}>
              <h1 className={styles.title}>All Courses</h1>
              <p className={styles.subtitle}>
                Explore our comprehensive course catalog
              </p>
            </div>

            {/* Search Section */}
            <div className={styles.searchSection}>
              <div className={styles.searchWrapper}>
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button type="submit" className={styles.searchButton}>
                    🔍
                  </button>
                </form>
              </div>
            </div>

            {/* Main Layout */}
            <div className={styles.coursesLayout}>
              {/* Sidebar Filters */}
              <aside className={styles.coursesSidebar}>
                {/* Categories Filter */}
                <div className={styles.filterSection}>
                  <h3>Categories</h3>
                  <div className={styles.categoryList}>
                    <button
                      className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ''}`}
                      onClick={() => setSelectedCategory("")}
                    >
                      <span>All Categories</span>
                      <span className={styles.categoryCount}>{courses.length}</span>
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`${styles.categoryItem} ${selectedCategory === category.name ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <span>{category.name}</span>
                        <span className={styles.categoryCount}>
                          {courses.filter(c => c.category === category.name).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className={styles.filterSection}>
                  <h3>Price</h3>
                  <div className={styles.filterOptions}>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={priceFilter === "all"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                      />
                      <span>All</span>
                    </label>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="price"
                        value="free"
                        checked={priceFilter === "free"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                      />
                      <span>Free</span>
                    </label>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="price"
                        value="paid"
                        checked={priceFilter === "paid"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                      />
                      <span>Paid</span>
                    </label>
                  </div>
                </div>

                {/* Level Filter */}
                <div className={styles.filterSection}>
                  <h3>Level</h3>
                  <div className={styles.filterOptions}>
                    <label className={styles.filterOption}>
                      <input type="checkbox" />
                      <span>Beginner</span>
                    </label>
                    <label className={styles.filterOption}>
                      <input type="checkbox" />
                      <span>Intermediate</span>
                    </label>
                    <label className={styles.filterOption}>
                      <input type="checkbox" />
                      <span>Advanced</span>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className={styles.coursesMain}>
                {/* Header with results count and sort */}
                <div className={styles.coursesHeader}>
                  <div className={styles.resultsCount}>
                    {loading ? 'Loading...' : `${sortedCourses.length} courses found`}
                  </div>
                  
                  <div className={styles.sortOptions}>
                    <label>Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={styles.sortSelect}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className={styles.errorMessage}>
                    <p>Error loading courses: {error}</p>
                    <button onClick={() => window.location.reload()}>
                      Try Again
                    </button>
                  </div>
                )}

                {/* Courses Grid */}
                {loading ? (
                  <div className={styles.courseGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className={`${styles.courseCard} ${styles.loading}`}>
                        <div className={styles.skeleton}></div>
                      </div>
                    ))}
                  </div>
                ) : sortedCourses.length > 0 ? (
                  <div className={styles.courseGrid}>
                    {sortedCourses.map((course) => (
                      <div key={course.id} className={styles.courseCard}>
                        <div className={styles.courseImage}>
                          <img 
                            src={course.image_url} 
                            alt={course.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                            }}
                          />
                          {course.is_bestseller && (
                            <div className={styles.bestsellerBadge}>BESTSELLER</div>
                          )}
                          <div className={styles.courseDuration}>{course.duration}</div>
                        </div>

                        <div className={styles.courseContent}>
                          <div className={styles.courseCategory}>
                            {course.category}
                          </div>
                          
                          <h3 className={styles.courseTitle}>
                            <a href={`/authorized/lms/courses/${course.id}`}>
                              {course.title}
                            </a>
                          </h3>
                          
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
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={i < Math.floor(course.rating) ? styles.starFull : styles.starEmpty}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className={styles.ratingNumber}>
                              {course.rating} ({course.rating_count?.toLocaleString() || 0} ratings)
                            </span>
                          </div>

                          <div className={styles.courseStats}>
                            <span>{course.students_enrolled?.toLocaleString() || 0} students enrolled</span>
                          </div>

                          <div className={styles.courseFooter}>
                            <div className={styles.coursePrice}>
                              <span className={styles.currentPrice}>${course.price}</span>
                              {course.original_price && course.original_price > course.price && (
                                <span className={styles.originalPrice}>${course.original_price}</span>
                              )}
                            </div>

                            <div className={styles.courseActions}>
                              <button className={styles.addToCartBtn}>
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noCourses}>
                    <h3>No courses found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}