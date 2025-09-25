"use client";

import React, { useState } from "react";
import { CourseSection, Lecture } from "../types";
import styles from "./LMS.module.css";

interface CourseContentProps {
  sections: CourseSection[];
}

export const CourseContent: React.FC<CourseContentProps> = ({ sections }) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLectureIcon = (type: Lecture['type']) => {
    switch (type) {
      case 'video': return '📹';
      case 'text': return '📄';
      case 'quiz': return '❓';
      case 'assignment': return '📝';
      case 'download': return '💾';
      default: return '📄';
    }
  };

  const totalLectures = sections.reduce((acc, section) => acc + section.lectures_count, 0);
  const totalDuration = sections.reduce((acc, section) => {
    // Simple duration calculation - would need proper time parsing in real app
    const minutes = parseInt(section.duration.split(':')[0]) * 60 + parseInt(section.duration.split(':')[1] || '0');
    return acc + minutes;
  }, 0);

  const formatTotalDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={styles.courseContent}>
      <div className={styles.contentHeader}>
        <h2>Course content</h2>
        <div className={styles.contentStats}>
          <button className={styles.expandAllBtn}>Expand all</button>
          <span>{totalLectures} lectures</span>
          <span>•</span>
          <span>{formatTotalDuration(totalDuration)}</span>
        </div>
      </div>

      <div className={styles.contentSections}>
        {sections.map((section) => (
          <div key={section.id} className={styles.contentSection}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
            >
              <div className={styles.sectionTitle}>
                <span className={styles.expandIcon}>
                  {expandedSections.includes(section.id) ? '▼' : '▶'}
                </span>
                <h3>{section.title}</h3>
              </div>
              <div className={styles.sectionMeta}>
                <span>{section.lectures_count} lectures</span>
                <span>•</span>
                <span>{section.duration}</span>
              </div>
            </div>

            {expandedSections.includes(section.id) && (
              <div className={styles.sectionLectures}>
                {section.lectures.map((lecture) => (
                  <div key={lecture.id} className={styles.lectureItem}>
                    <div className={styles.lectureInfo}>
                      <span className={styles.lectureIcon}>
                        {getLectureIcon(lecture.type)}
                      </span>
                      <span className={styles.lectureTitle}>
                        {lecture.title}
                      </span>
                    </div>
                    <div className={styles.lectureActions}>
                      {lecture.is_preview && (
                        <button className={styles.previewBtn}>Preview</button>
                      )}
                      {lecture.duration && (
                        <span className={styles.lectureDuration}>
                          {lecture.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};