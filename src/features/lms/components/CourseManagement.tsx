// src/features/lms/components/CourseManagement.tsx
"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/features/auth";
import styles from "./LMS.module.css";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  startTime: string;
  endTime: string;
}

export const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    categoryId: 0,
    status: 'UPCOMING',
    startTime: '',
    endTime: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await apiClient.getCourses();
      if (response.result) {
        setCourses(response.result);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Create course JSON
      const courseData = {
        ...formData,
        teacherId: user?.id // Set current user as teacher
      };
      
      formDataToSend.append('course', JSON.stringify(courseData));
      formDataToSend.append('file', selectedFile);

      const response = await apiClient.createCourse(formDataToSend);
      
      if (response.result) {
        alert('Course created successfully!');
        setShowCreateForm(false);
        resetForm();
        loadCourses(); // Reload courses list
      }
    } catch (error: any) {
      console.error('Error creating course:', error);
      alert(`Failed to create course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'categoryId' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      categoryId: 0,
      status: 'UPCOMING',
      startTime: '',
      endTime: ''
    });
    setSelectedFile(null);
  };

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await apiClient.deleteCourse(courseId);
      alert('Course deleted successfully!');
      loadCourses(); // Reload courses list
    } catch (error: any) {
      console.error('Error deleting course:', error);
      alert(`Failed to delete course: ${error.message}`);
    }
  };

  return (
    <div className={styles.courseManagement}>
      <div className={styles.managementHeader}>
        <h1>Course Management</h1>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Course'}
        </button>
      </div>

      {/* Create Course Form */}
      {showCreateForm && (
        <div className={styles.createForm}>
          <h2>Create New Course</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={styles.formTextarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Course Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.resetBtn}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List */}
      <div className={styles.coursesList}>
        <h2>Your Courses ({courses.length})</h2>
        
        {courses.length === 0 ? (
          <div className={styles.noCourses}>
            <p>No courses found. Create your first course!</p>
          </div>
        ) : (
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseImage}>
                  {course.img && (
                    <img 
                      src={`http://localhost:8083${course.img}`} 
                      alt={course.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                      }}
                    />
                  )}
                </div>
                
                <div className={styles.courseInfo}>
                  <h3>{course.title}</h3>
                  <p className={styles.courseDescription}>
                    {course.description || 'No description available'}
                  </p>
                  
                  <div className={styles.courseMeta}>
                    <span className={styles.coursePrice}>${course.price}</span>
                    <span className={`${styles.courseStatus} ${styles[course.status.toLowerCase()]}`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <div className={styles.courseActions}>
                    <button className={styles.editBtn}>Edit</button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => deleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};