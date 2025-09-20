import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import './QuizTaker.css';

const QuizTaker = ({ isOpen, onClose, quiz, questions, offerId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleSubmitQuiz = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      // Préparer les réponses au format attendu par l'API
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const response = await fetch(`http://localhost:7001/api/quiz/${quiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: formattedAnswers
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to submit quiz");
        return;
      }

      const result = await response.json();
      toast.success("Quiz submitted successfully!");
      console.log("Quiz result:", result);
      
      onClose();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, quiz?._id, onClose]);

  useEffect(() => {
    if (isOpen && quiz && quiz.durationSeconds > 0) {
      setTimeLeft(quiz.durationSeconds);
      setQuizStarted(true);
    }
  }, [isOpen, quiz]);

  // Timer countdown
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Avertir avant de fermer pendant un quiz
      if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
        onClose();
      }
    }
  };

  if (!isOpen || !quiz || !questions) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="quiz-taker-overlay" onClick={handleBackdropClick}>
      <div className="quiz-taker-container">
        {/* Header with timer and progress */}
        <div className="quiz-header">
          <div className="quiz-title">
            <h2>{quiz.title}</h2>
            <div className="quiz-meta">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <div className="quiz-controls">
            {quiz.durationSeconds > 0 && (
              <div className="timer">
                <span className="timer-icon">⏰</span>
                <span className="timer-text">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button className="close-quiz-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {answeredQuestions}/{questions.length} answered
          </div>
        </div>

        {/* Question navigation */}
        <div className="question-nav">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentQuestionIndex ? 'active' : ''} ${
                answers[questions[index]._id] ? 'answered' : ''
              }`}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current question */}
        <div className="question-container">
          <div className="question-header">
            <h3>{currentQuestion.questionText}</h3>
            <div className="question-score">
              Score: {currentQuestion.score} points
            </div>
          </div>

          <div className="answers-container">
            {currentQuestion.questionType === 'multiple-choice' && 
             currentQuestion.choices && currentQuestion.choices.map((choice, index) => (
              <label key={index} className="answer-option">
                <input
                  type="radio"
                  name={`question_${currentQuestion._id}`}
                  value={choice}
                  checked={answers[currentQuestion._id] === choice}
                  onChange={() => handleAnswerChange(currentQuestion._id, choice)}
                />
                <span className="answer-text">{choice}</span>
              </label>
            ))}

            {currentQuestion.questionType === 'true-false' && (
              <div className="true-false-container">
                <label className="answer-option">
                  <input
                    type="radio"
                    name={`question_${currentQuestion._id}`}
                    value="true"
                    checked={answers[currentQuestion._id] === 'true'}
                    onChange={() => handleAnswerChange(currentQuestion._id, 'true')}
                  />
                  <span className="answer-text">True</span>
                </label>
                <label className="answer-option">
                  <input
                    type="radio"
                    name={`question_${currentQuestion._id}`}
                    value="false"
                    checked={answers[currentQuestion._id] === 'false'}
                    onChange={() => handleAnswerChange(currentQuestion._id, 'false')}
                  />
                  <span className="answer-text">False</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="quiz-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          <div className="nav-center">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                className="submit-btn"
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || answeredQuestions === 0}
              >
                {isSubmitting ? 'Submitting...' : `Submit Quiz (${answeredQuestions}/${questions.length})`}
              </button>
            ) : (
              <button
                className="nav-btn next-btn"
                onClick={goToNextQuestion}
              >
                Next
              </button>
            )}
          </div>

          <div className="nav-spacer"></div>
        </div>

        {/* Quiz summary sidebar */}
        <div className="quiz-summary">
          <h4>Quiz Summary</h4>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total Questions:</span>
              <span className="stat-value">{questions.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Answered:</span>
              <span className="stat-value">{answeredQuestions}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Score:</span>
              <span className="stat-value">{quiz.totalScore} points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;