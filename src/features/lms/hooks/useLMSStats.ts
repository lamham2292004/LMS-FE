"use client";

import { useState, useEffect } from "react";
import { LMSStats } from "../types";
import { apiClient } from "@/lib/api";

export const useLMSStats = () => {
  const [stats, setStats] = useState<LMSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.request<LMSStats>("/v1/lms/stats");
        
        if (response.data) {
          setStats(response.data);
        }
      } catch (err: any) {
        setError(err.message);
        // Mock data for development
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