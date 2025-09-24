"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import { DashboardHeader } from "@/features/dashboard";
import styles from "../../dashboard/dashboard.module.css";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="admin">
      <div className={styles.dashboard}>
        <DashboardHeader />

        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.description}>
              Chào mừng Admin đến với hệ thống quản lý giáo dục
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Tổng Sinh Viên</h3>
                <p className={styles.statNumber}>150</p>
                <p className={styles.statLabel}>Người</p>
              </div>

              <div className={styles.statCard}>
                <h3>Tổng Giảng Viên</h3>
                <p className={styles.statNumber}>25</p>
                <p className={styles.statLabel}>Người</p>
              </div>

              <div className={styles.statCard}>
                <h3>Lớp Học</h3>
                <p className={styles.statNumber}>18</p>
                <p className={styles.statLabel}>Lớp</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
