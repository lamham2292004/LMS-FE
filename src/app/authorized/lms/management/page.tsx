// src/app/authorized/lms/management/page.tsx
"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import { CourseManagement } from "@/features/lms/components/CourseManagement";

export default function LMSManagementPage() {
  return (
    <ProtectedRoute requiredUserType="lecturer">
      <CourseManagement />
    </ProtectedRoute>
  );
}