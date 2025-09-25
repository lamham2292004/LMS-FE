"use client";

import React, { useState, useEffect } from "react";
import { Test, Question } from "../types";
import { useTest } from "../hooks/useTest";
import styles from "./LMS.module.css";

interface TestViewProps {
  test: Test;
}

export const TestView: React.FC<TestViewProps> = ({ test }) => {
  const {
    questions,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswer,
    timeRemaining,
    submitTest,
    loading
  } = useTest(test.id);

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswer(questionId, answer);
  };

  const handleSubmit = async () => {
    if (showSubmitConfirm) {
      await submitTest();
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return <div className={styles.loading}>Loading test...</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className={styles.testView}>
      {/* Test Header */}
      <div className={styles.testHeader}>
        <div className={styles.testInfo}>
          <h1>{test.title}</h1>
          <div className={styles.testMeta}>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>•</span>
            <span>{getAnsweredCount()} answered</span>
          </div>
        </div>

        <div className={styles.testTimer}>
          <div className={styles.timerDisplay}>
            <span className={styles.timerIcon}>⏰</span>
            <span className={styles.timeRemaining}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className={styles.questionNavigation}>
        <div className={styles.questionNumbers}>
          {questions.map((_, index) => (
            <button
              key={index}
              className={`${styles.questionNumber} ${
                index === currentQuestion ? styles.current : ''
              } ${
                answers[questions[index]?.id] ? styles.answered : ''
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className={styles.questionSection}>
        <div className={styles.questionHeader}>
          <h2>Question {currentQuestion + 1}</h2>
          <span className={styles.questionPoints}>
            {question.points} point{question.points !== 1 ? 's' : ''}
          </span>
        </div>

        <div className={styles.questionContent}>
          <p className={styles.questionText}>{question.question}</p>

          {/* Multiple Choice */}
          {question.type === 'multiple_choice' && (
            <div className={styles.multipleChoice}>
              {question.options?.map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className={styles.optionInput}
                  />
                  <span className={styles.optionText}>{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* True/False */}
          {question.type === 'true_false' && (
            <div className={styles.trueFalse}>
              <label className={styles.optionLabel}>
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value="true"
                  checked={answers[question.id] === 'true'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className={styles.optionInput}
                />
                <span className={styles.optionText}>True</span>
              </label>
              <label className={styles.optionLabel}>
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value="false"
                  checked={answers[question.id] === 'false'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className={styles.optionInput}
                />
                <span className={styles.optionText}>False</span>
              </label>
            </div>
          )}

          {/* Text Answer */}
          {(question.type === 'text' || question.type === 'essay') && (
            <div className={styles.textAnswer}>
              <textarea
                value={answers[question.id] as string || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Enter your answer..."
                className={styles.textArea}
                rows={question.type === 'essay' ? 8 : 3}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className={styles.questionActions}>
          <button
            className={styles.prevBtn}
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          <button
            className={styles.nextBtn}
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === questions.length - 1}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Submit Section */}
      <div className={styles.submitSection}>
        {showSubmitConfirm ? (
          <div className={styles.submitConfirm}>
            <h3>Submit Test?</h3>
            <p>
              You have answered {getAnsweredCount()} out of {questions.length} questions.
              Once submitted, you cannot change your answers.
            </p>
            <div className={styles.confirmActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.submitBtn}
                onClick={handleSubmit}
              >
                Submit Test
              </button>
            </div>
          </div>
        ) : (
          <button 
            className={styles.submitBtn}
            onClick={handleSubmit}
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
};