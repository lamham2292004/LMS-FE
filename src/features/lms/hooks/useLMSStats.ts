// src/features/lms/hooks/useLMSStats.ts
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export interface LMSStats {
  total_courses: number;
  total_students: number;
  total_instructors: number;
  total_revenue: number;
  courses_completed: number;
  certificates_issued: number;
  average_rating: number;
  active_enrollments: number;
}

export const useLMSStats = () => {
  const [stats, setStats] = useState<LMSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Since we don't have a dedicated stats endpoint yet,
        // we'll gather stats from multiple endpoints
        const [coursesResponse, enrollmentsResponse] = await Promise.all([
          apiClient.getCourses().catch(() => ({ result: [] })),
          apiClient.getAllEnrollments().catch(() => ({ result: [] }))
        ]);

        const courses = coursesResponse.result || [];
        const enrollments = enrollmentsResponse.result || [];

        // Calculate stats from available data
        const calculatedStats: LMSStats = {
          total_courses: courses.length,
          total_students: new Set(enrollments.map((e: any) => e.studentId)).size,
          total_instructors: new Set(courses.map((c: any) => c.teacherId)).size,
          total_revenue: enrollments.length * 50, // Mock revenue calculation
          courses_completed: enrollments.filter((e: any) => e.status === 'COMPLETED').length,
          certificates_issued: Math.floor(enrollments.length * 0.7), // Mock 70% completion rate
          average_rating: 4.6, // Mock average rating
          active_enrollments: enrollments.filter((e: any) => e.status === 'ACTIVE').length
        };

        setStats(calculatedStats);
        
      } catch (err: any) {
        console.error('Error fetching LMS stats:', err);
        setError(err.message);
        
        // Fallback to mock data
        setStats({
          total_courses: 156,
          total_students: 2847,
          total_instructors: 24,
          total_revenue: 45600,
          courses_completed: 389,
          certificates_issued: 245,
          average_rating: 4.6,
          active_enrollments: 1203
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};