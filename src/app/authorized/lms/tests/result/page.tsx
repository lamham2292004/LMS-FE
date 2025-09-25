"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/features/auth";
import { TestResultComponent } from "@/features/lms/components/TestResult";
import { TestResult } from "@/features/lms/types";

export default function TestResultPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get result from localStorage (in real app, fetch from API)
    const storedResult = localStorage.getItem('test_result');
    if (storedResult) {
      const resultData = JSON.parse(storedResult);
      const mockResult: TestResult = {
        id: 1,
        test_id: 1,
        user_id: 1,
        score: resultData.score || 15,
        percentage: resultData.percentage || 75,
        correct_answers: resultData.correct_answers || 15,
        wrong_answers: resultData.wrong_answers || 5,
        total_questions: resultData.total_questions || 20,
        time_taken: resultData.time_taken || 45,
        passed: resultData.passed || true,
        completed_at: resultData.completed_at || new Date().toISOString(),
        answers: []
      };
      setResult(mockResult);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading results...</div>;
  }

  if (!result) {
    return <div>No results found</div>;
  }

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <TestResultComponent 
          result={result} 
          testTitle="WordPress Test View"
        />
      </div>
    </ProtectedRoute>
  );
}