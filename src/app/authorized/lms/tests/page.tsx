"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/features/auth";
import { DashboardHeader } from "@/features/dashboard";
import { Test } from "@/features/lms/types";
import styles from "@/features/lms/components/LMS.module.css";

export default function TestsPage() {
  const [tests] = useState<Test[]>([
    {
      id: 1,
      title: "WordPress Test View",
      description: "Test your knowledge of WordPress basics and advanced concepts",
      course_id: 1,
      questions_count: 20,
      duration: 60, // 60 minutes
      passing_score: 70,
      attempts_allowed: 3,
      status: "active",
      created_at: "2024-01-15"
    },
    {
      id: 2,
      title: "JavaScript Fundamentals Quiz",
      description: "Comprehensive test covering JavaScript ES6+ features",
      course_id: 2,
      questions_count: 15,
      duration: 45,
      passing_score: 75,
      attempts_allowed: 2,
      status: "active",
      created_at: "2024-01-10"
    },
    {
      id: 3,
      title: "React Components Assessment",
      description: "Test your understanding of React components and hooks",
      course_id: 3,
      questions_count: 25,
      duration: 90,
      passing_score: 80,
      attempts_allowed: 3,
      status: "active",
      created_at: "2024-01-05"
    }
  ]);

  return (
    <ProtectedRoute>
      <div className={styles.lmsDashboard}>
        <DashboardHeader />
        
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.headerSection}>
              <h1 className={styles.title}>Bài kiểm tra</h1>
              <p className={styles.subtitle}>
                Kiểm tra kiến thức của bạn với các bài test chất lượng cao
              </p>
            </div>

            <div className={styles.testsGrid}>
              {tests.map((test) => (
                <div key={test.id} className={styles.testCard}>
                  <div className={styles.testHeader}>
                    <h3 className={styles.testTitle}>{test.title}</h3>
                    <div className={styles.testMeta}>
                      <span className={`${styles.testStatus} ${styles[test.status]}`}>
                        {test.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>

                  <p className={styles.testDescription}>{test.description}</p>

                  <div className={styles.testInfo}>
                    <div className={styles.testInfoItem}>
                      <strong>Số câu hỏi:</strong> {test.questions_count}
                    </div>
                    <div className={styles.testInfoItem}>
                      <strong>Thời gian:</strong> {test.duration} phút
                    </div>
                    <div className={styles.testInfoItem}>
                      <strong>Điểm đạt:</strong> {test.passing_score}%
                    </div>
                    <div className={styles.testInfoItem}>
                      <strong>Số lần thử:</strong> {test.attempts_allowed}
                    </div>
                  </div>

                  <div className={styles.testActions}>
                    <Link 
                      href={`/authorized/lms/tests/${test.id}`}
                      className={styles.startTestBtn}
                    >
                      Bắt đầu kiểm tra
                    </Link>
                    <button className={styles.previewTestBtn}>
                      Xem trước
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}