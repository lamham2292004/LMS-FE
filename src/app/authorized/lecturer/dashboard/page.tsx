"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import { DashboardHeader } from "@/features/dashboard";
import styles from "../../dashboard/dashboard.module.css";

export default function LecturerDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="lecturer">
      <div className={styles.dashboard}>
        <DashboardHeader />

        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Lecturer Dashboard</h1>
            <p className={styles.description}>
              Chào mừng Giảng viên đến với hệ thống quản lý giáo dục
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Lớp Dạy</h3>
                <p className={styles.statNumber}>4</p>
                <p className={styles.statLabel}>Lớp</p>
              </div>

              <div className={styles.statCard}>
                <h3>Sinh Viên</h3>
                <p className={styles.statNumber}>120</p>
                <p className={styles.statLabel}>Người</p>
              </div>

              <div className={styles.statCard}>
                <h3>Bài Tập</h3>
                <p className={styles.statNumber}>15</p>
                <p className={styles.statLabel}>Chưa chấm</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
