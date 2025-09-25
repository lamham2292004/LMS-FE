"use client";

import { useState, useEffect } from "react";
import { Question, Test } from "../types";

export const useTest = (testId: number) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load test questions
    const loadTest = async () => {
      try {
        // Mock questions for development
        const mockQuestions: Question[] = [
          {
            id: 1,
            test_id: testId,
            question: "What is the name of the first page you encounter after logging into your web page?",
            type: "multiple_choice",
            options: ["Dashboard", "Security question page", "WP upgrade option", "WPAdmin"],
            correct_answer: "Dashboard",
            points: 5,
            explanation: "The dashboard is typically the first page users see after logging in."
          },
          {
            id: 2,
            test_id: testId,
            question: "What is WordPress?",
            type: "essay",
            points: 10,
            explanation: "WordPress is a content management system (CMS) that allows users to create and manage websites."
          },
          {
            id: 3,
            test_id: testId,
            question: "How can you get involved with WordPress?",
            type: "multiple_choice",
            options: ["Attend Word Camp", "Edit the Codex (documentation)", "Help in the Forums", "All of these"],
            correct_answer: "All of these",
            points: 5
          },
          {
            id: 4,
            test_id: testId,
            question: "What ways to use WordPress?",
            type: "multiple_choice",
            options: ["Arcade", "Blog", "Content Management System (CMS)", "All of the above"],
            correct_answer: "All of the above",
            points: 5
          }
        ];

        setQuestions(mockQuestions);
        setTimeRemaining(60 * 60); // 60 minutes in seconds
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && questions.length > 0) {
      // Auto-submit when time runs out
      submitTest();
    }
  }, [timeRemaining]);

  const setAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = async () => {
    try {
      // Calculate score
      let correctAnswers = 0;
      let totalPoints = 0;
      let earnedPoints = 0;

      questions.forEach(question => {
        totalPoints += question.points;
        const userAnswer = answers[question.id];
        
        if (userAnswer && question.correct_answer) {
          if (Array.isArray(question.correct_answer)) {
            // Multiple correct answers
            if (Array.isArray(userAnswer) && 
                userAnswer.sort().join(',') === question.correct_answer.sort().join(',')) {
              correctAnswers++;
              earnedPoints += question.points;
            }
          } else {
            // Single correct answer
            if (userAnswer === question.correct_answer) {
              correctAnswers++;
              earnedPoints += question.points;
            }
          }
        }
      });

      const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
      const passed = percentage >= 70; // 70% passing grade

      // Redirect to results page with data
      const resultData = {
        score: earnedPoints,
        percentage,
        correct_answers: correctAnswers,
        wrong_answers: questions.length - correctAnswers,
        total_questions: questions.length,
        passed,
        time_taken: Math.ceil((60 * 60 - timeRemaining) / 60), // minutes
        completed_at: new Date().toISOString()
      };

      // Store result in localStorage for demo
      localStorage.setItem('test_result', JSON.stringify(resultData));
      
      // Navigate to results
      window.location.href = '/authorized/lms/tests/result';
      
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  return {
    questions,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswer,
    timeRemaining,
    submitTest,
    loading
  };
};
