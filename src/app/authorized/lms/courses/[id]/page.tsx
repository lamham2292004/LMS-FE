"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/features/auth";
import { CourseDetail } from "@/features/lms/components/CourseDetail";
import { Course } from "@/features/lms/types";

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock course data for demo
    const mockCourse: Course = {
      id: Number(params.id),
      title: "The Web Developer Bootcamp",
      description: "The only course you need to learn web development - HTML, CSS, JS, Node, and More!",
      image_url: "https://img-c.udemycdn.com/course/750x422/625204_436a_3.jpg",
      price: 10,
      original_price: 74.99,
      discount_percentage: 87,
      instructor_name: "Johnson Smith",
      instructor_avatar: "/avatars/johnson.jpg",
      category: "Web Development",
      subcategory: "Full Stack",
      duration: "47:06:29",
      lectures_count: 402,
      students_enrolled: 114521,
      rating: 4.6,
      rating_count: 81665,
      is_bestseller: true,
      level: "Beginner",
      languages: ["English", "Dutch"],
      last_updated: "1/2024",
      status: "published",
      created_at: "2024-01-01",
      updated_at: "2024-01-15",
      sections: [
        {
          id: 1,
          title: "Introduction to this Course",
          lectures_count: 8,
          duration: "22:08",
          lectures: [
            {
              id: 1,
              title: "A Note On Asking For Help",
              type: "text",
              duration: "00:12",
              is_preview: false
            },
            {
              id: 2,
              title: "Introducing Our TA",
              type: "video",
              duration: "01:42",
              is_preview: true
            },
            {
              id: 3,
              title: "Join the Online Community",
              type: "video",
              duration: "00:51",
              is_preview: false
            },
            {
              id: 4,
              title: "Why This Course?",
              type: "video",
              duration: "07:48",
              is_preview: true
            },
            {
              id: 5,
              title: "Syllabus Download",
              type: "download",
              is_preview: true
            },
            {
              id: 6,
              title: "Syllabus Walkthrough",
              type: "video",
              duration: "01:42",
              is_preview: true
            },
            {
              id: 7,
              title: "Lecture Slides",
              type: "text",
              duration: "00:11",
              is_preview: false
            }
          ]
        },
        {
          id: 2,
          title: "Introduction to Front End Development",
          lectures_count: 6,
          duration: "27:26",
          lectures: [
            {
              id: 8,
              title: "Introduction to Front End Development",
              type: "video",
              duration: "27:26",
              is_preview: false
            }
          ]
        },
        {
          id: 3,
          title: "Introduction to HTML",
          lectures_count: 13,
          duration: "58:55",
          lectures: []
        },
        {
          id: 4,
          title: "Intermediate HTML",
          lectures_count: 13,
          duration: "01:12:29",
          lectures: []
        }
      ],
      requirements: [
        "Have a computer with Internet",
        "Be ready to learn an insane amount of awesome stuff",
        "Prepare to build real web apps!"
      ],
      what_you_learn: [
        "Build 16 beautiful real-world projects for your portfolio",
        "Master modern JavaScript from scratch", 
        "Learn Node.js and Express.js",
        "Understand how JavaScript works behind the scenes",
        "Build modern and beautiful user interfaces",
        "Become job-ready by understanding how JavaScript really works"
      ]
    };

    setCourse(mockCourse);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <ProtectedRoute>
      <CourseDetail course={course} />
    </ProtectedRoute>
  );
}