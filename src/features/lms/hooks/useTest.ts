// src/features/lms/hooks/useTest.ts
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  orderIndex: number;
  points: number;
  createdAt: string;
  updatedAt: string;
  answerOptions?: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  questionId: number;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  course_id: number;
  questions_count: number;
  duration: number; // minutes
  passing_score: number;
  attempts_allowed: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export const useTest = (testId: number) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canTake, setCanTake] = useState<boolean>(true);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);

        // First check if user can take this quiz
        const canTakeResponse = await apiClient.canTakeQuiz(testId);
        if (canTakeResponse.result !== undefined) {
          setCanTake(canTakeResponse.result);
          if (!canTakeResponse.result) {
            setLoading(false);
            return;
          }
        }

        // Load quiz details
        const quizResponse = await apiClient.getQuizById(testId);
        if (quizResponse.result) {
          const quizData = quizResponse.result;
          setQuiz(quizData);
          
          // Set timer
          if (quizData.timeLimit) {
            setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
          }
        }

        // Load questions for the quiz
        const questionsResponse = await apiClient.getQuestionsByQuiz(testId);
        if (questionsResponse.result) {
          const questionsData = questionsResponse.result;
          
          // Load answer options for each question
          const questionsWithOptions = await Promise.all(
            questionsData.map(async (question: Question) => {
              if (question.questionType === 'MULTIPLE_CHOICE') {
                try {
                  const optionsResponse = await apiClient.getAnswerOptionsByQuestion(question.id);
                  return {
                    ...question,
                    answerOptions: optionsResponse.result || []
                  };
                } catch (error) {
                  console.warn(`Failed to load options for question ${question.id}:`, error);
                  return question;
                }
              }
              return question;
            })
          );

          // Sort by order index
          questionsWithOptions.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
          setQuestions(questionsWithOptions);
        }

      } catch (error) {
        console.error('Error loading test:', error);
        setCanTake(false);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      loadTest();
    }
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && questions.length > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && questions.length > 0) {
      // Auto-submit when time runs out
      submitTest();
    }
  }, [timeRemaining, questions.length]);

  const setAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = async () => {
    try {
      setLoading(true);

      // Prepare answers for submission
      const formattedAnswers: Record<number, string> = {};
      
      Object.entries(answers).forEach(([questionId, answer]) => {
        if (Array.isArray(answer)) {
          formattedAnswers[parseInt(questionId)] = answer.join(',');
        } else {
          formattedAnswers[parseInt(questionId)] = answer;
        }
      });

      // Calculate time taken
      const timeTaken = quiz?.timeLimit ? 
        Math.ceil((quiz.timeLimit * 60 - timeRemaining) / 60) : 
        0;

      // Submit to backend
      const submitData = {
        quizId: testId,
        answers: formattedAnswers,
        timeTaken
      };

      const response = await apiClient.submitQuiz(submitData);
      
      if (response.result) {
        // Redirect to results page
        const resultData = response.result;
        localStorage.setItem('test_result', JSON.stringify(resultData));
        window.location.href = '/authorized/lms/tests/result';
      }
      
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Transform questions to match UI expectations
  const transformedQuestions = questions.map(q => ({
    id: q.id,
    test_id: testId,
    question: q.questionText,
    type: q.questionType.toLowerCase().replace('_', '_') as 'multiple_choice' | 'true_false' | 'short_answer',
    options: q.answerOptions?.map(opt => opt.answerText) || [],
    correct_answer: q.answerOptions?.find(opt => opt.isCorrect)?.answerText,
    points: q.points,
    explanation: undefined // Backend doesn't have explanation field
  }));

  return {
    quiz,
    questions: transformedQuestions,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswer,
    timeRemaining,
    submitTest,
    loading,
    canTake
  };
};