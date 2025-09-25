"use client";

import React from "react";
import { TestResult } from "../types";
import styles from "./LMS.module.css";

interface TestResultProps {
  result: TestResult;
  testTitle: string;
}

export const TestResultComponent: React.FC<TestResultProps> = ({ result, testTitle }) => {
  const getResultMessage = () => {
    if (result.passed) {
      return "Congratulations! You passed!";
    } else {
      return "Unfortunately, you didn't pass this time.";
    }
  };

  const getResultDescription = () => {
    if (result.passed) {
      return "You are eligible for this certificate";
    } else {
      return "You need to score at least 70% to pass. Keep studying and try again!";
    }
  };

  return (
    <div className={styles.testResult}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>Home</span> / <span>Certification Center</span> / <span>Result</span>
      </div>

      <h1 className={styles.resultTitle}>Result</h1>

      {/* Result Summary */}
      <div className={styles.resultSummary}>
        <div className={styles.resultCircles}>
          {/* Correct Answers */}
          <div className={styles.resultCircle}>
            <div className={`${styles.circle} ${styles.correctCircle}`}>
              <span className={styles.checkmark}>✓</span>
            </div>
            <div className={styles.circleLabel}>
              <strong>Right ({result.correct_answers})</strong>
            </div>
          </div>

          {/* Wrong Answers */}
          <div className={styles.resultCircle}>
            <div className={`${styles.circle} ${styles.wrongCircle}`}>
              <span className={styles.crossmark}>✕</span>
            </div>
            <div className={styles.circleLabel}>
              <strong>Wrong ({result.wrong_answers})</strong>
            </div>
          </div>

          {/* Score */}
          <div className={styles.resultCircle}>
            <div className={`${styles.circle} ${styles.scoreCircle}`}>
              <span className={styles.scoreNumber}>{result.score}</span>
            </div>
            <div className={styles.circleLabel}>
              <strong>Out of {result.total_questions}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Congratulations Message */}
      <div className={styles.congratsSection}>
        <h2 className={styles.congratsTitle}>{getResultMessage()}</h2>
        <p className={styles.congratsDescription}>{getResultDescription()}</p>

        {result.passed && (
          <button className={styles.downloadCertBtn}>
            Download Certificate
          </button>
        )}

        {!result.passed && (
          <div className={styles.retrySection}>
            <button className={styles.retryBtn}>
              Try Again
            </button>
            <button className={styles.reviewBtn}>
              Review Answers
            </button>
          </div>
        )}
      </div>

      {/* Detailed Results */}
      <div className={styles.detailedResults}>
        <h3>Test Details</h3>
        <div className={styles.resultDetails}>
          <div className={styles.resultRow}>
            <span>Test:</span>
            <span>{testTitle}</span>
          </div>
          <div className={styles.resultRow}>
            <span>Score:</span>
            <span>{result.percentage.toFixed(1)}%</span>
          </div>
          <div className={styles.resultRow}>
            <span>Time taken:</span>
            <span>{result.time_taken} minutes</span>
          </div>
          <div className={styles.resultRow}>
            <span>Completed:</span>
            <span>{new Date(result.completed_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};