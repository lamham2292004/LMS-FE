"use client";

import React from "react";
import styles from "./LMS.module.css";

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: "enrollment",
      user: "John Doe",
      course: "React Fundamentals",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "completion",
      user: "Jane Smith", 
      course: "JavaScript Basics",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "test_passed",
      user: "Mike Johnson",
      course: "Node.js Advanced",
      time: "1 day ago"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment": return "📚";
      case "completion": return "🎉";
      case "test_passed": return "✅";
      default: return "📋";
    }
  };

  const getActivityText = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case "enrollment":
        return `${activity.user} đã đăng ký khóa học ${activity.course}`;
      case "completion":
        return `${activity.user} đã hoàn thành ${activity.course}`;
      case "test_passed":
        return `${activity.user} đã vượt qua bài kiểm tra ${activity.course}`;
      default:
        return `${activity.user} có hoạt động mới`;
    }
  };

  return (
    <div className={styles.recentActivity}>
      <h3>Hoạt động gần đây</h3>
      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              {getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                {getActivityText(activity)}
              </p>
              <span className={styles.activityTime}>
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};