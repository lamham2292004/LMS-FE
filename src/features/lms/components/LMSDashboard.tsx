"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import { DashboardHeader } from "@/features/dashboard";
import { useLMSStats } from "../hooks/useLMSStats";
import { CourseGrid } from "./CourseGrid";
import { StatsCards } from "./StatsCards";
import { RecentActivity } from "./RecentActivity";
import styles from "./LMS.module.css";

export const LMSDashboard: React.FC = () => {
  const { stats, loading } = useLMSStats();

  return (
    <ProtectedRoute>
      <div className={styles.lmsDashboard}>
        <DashboardHeader />

        <main className={styles.main}>
          <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.headerSection}>
              <h1 className={styles.title}>Hệ thống Quản lý Học tập (LMS)</h1>
              <p className={styles.subtitle}>
                Quản lý khóa học, bài kiểm tra và theo dõi tiến độ học tập
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} loading={loading} />

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
              {/* Featured Courses */}
              <section className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                  <h2>Khóa học nổi bật</h2>
                  <button className={styles.seeAllBtn}>Xem tất cả</button>
                </div>
                <CourseGrid featured={true} limit={6} />
              </section>

              {/* Recent Activity */}
              <aside className={styles.sidebar}>
                <RecentActivity />
                
                {/* Quick Actions */}
                <div className={styles.quickActions}>
                  <h3>Thao tác nhanh</h3>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn}>
                      ➕ Tạo khóa học mới
                    </button>
                    <button className={styles.actionBtn}>
                      📝 Tạo bài kiểm tra
                    </button>
                    <button className={styles.actionBtn}>
                      📊 Xem báo cáo
                    </button>
                    <button className={styles.actionBtn}>
                      👥 Quản lý học viên
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};