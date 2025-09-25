"use client";

import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/features/auth";
import { TestView } from "@/features/lms/components/TestView";
import { Test } from "@/features/lms/types";

export default function TestPage() {
  const params = useParams();
  
  // Mock test data
  const test: Test = {
    id: Number(params.id),
    title: "WordPress Test View",
    description: "Test your knowledge of WordPress",
    course_id: 1,
    questions_count: 20,
    duration: 60,
    passing_score: 70,
    attempts_allowed: 3,
    status: "active",
    created_at: "2024-01-15"
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <TestView test={test} />
      </div>
    </ProtectedRoute>
  );
}