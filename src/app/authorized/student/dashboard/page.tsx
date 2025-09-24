"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import { DashboardHeader } from "@/features/dashboard";
import styles from "../../dashboard/dashboard.module.css";

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="student">
      <div className={styles.dashboard}>
        <DashboardHeader />

        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Student Dashboard</h1>
            <p className={styles.description}>
              Chào mừng Sinh viên đến với hệ thống quản lý giáo dục
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Môn Học</h3>
                <p className={styles.statNumber}>6</p>
                <p className={styles.statLabel}>Đang học</p>
              </div>

              <div className={styles.statCard}>
                <h3>Điểm TB</h3>
                <p className={styles.statNumber}>8.5</p>
                <p className={styles.statLabel}>Điểm</p>
              </div>

              <div className={styles.statCard}>
                <h3>Thông Báo</h3>
                <p className={styles.statNumber}>3</p>
                <p className={styles.statLabel}>Chưa đọc</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
