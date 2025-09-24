"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import { DashboardHeader } from "@/features/dashboard";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className={styles.dashboard}>
        <DashboardHeader />

        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.description}>
              Chào mừng bạn đến với hệ thống quản lý giáo dục
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Môn học</h3>
                <p className={styles.statNumber}>12</p>
                <p className={styles.statLabel}>Đang theo học</p>
              </div>

              <div className={styles.statCard}>
                <h3>Điểm số</h3>
                <p className={styles.statNumber}>8.5</p>
                <p className={styles.statLabel}>Trung bình</p>
              </div>

              <div className={styles.statCard}>
                <h3>Thông báo</h3>
                <p className={styles.statNumber}>5</p>
                <p className={styles.statLabel}>Chưa đọc</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
