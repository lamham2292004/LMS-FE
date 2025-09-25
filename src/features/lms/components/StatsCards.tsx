"use client";

import React from "react";
import { LMSStats } from "../types";
import styles from "./LMS.module.css";

interface StatsCardsProps {
  stats: LMSStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.statCard} ${styles.loading}`}>
            <div className={styles.skeleton}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>📚</div>
        <div className={styles.statContent}>
          <h3>{stats?.total_courses || 0}</h3>
          <p>Tổng số khóa học</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>👥</div>
        <div className={styles.statContent}>
          <h3>{stats?.total_students || 0}</h3>
          <p>Học viên đăng ký</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>👨‍🏫</div>
        <div className={styles.statContent}>
          <h3>{stats?.total_instructors || 0}</h3>
          <p>Giảng viên</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>🏆</div>
        <div className={styles.statContent}>
          <h3>{stats?.certificates_issued || 0}</h3>
          <p>Chứng chỉ cấp</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>⭐</div>
        <div className={styles.statContent}>
          <h3>{stats?.average_rating?.toFixed(1) || "0.0"}</h3>
          <p>Đánh giá trung bình</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>💰</div>
        <div className={styles.statContent}>
          <h3>${stats?.total_revenue?.toLocaleString() || 0}</h3>
          <p>Tổng doanh thu</p>
        </div>
      </div>
    </div>
  );
};