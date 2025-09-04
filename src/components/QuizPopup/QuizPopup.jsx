import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './QuizPopup.css';

const QuizPopup = ({ isOpen, onClose, offerId }) => {
  const [hasQuiz, setHasQuiz] = useState(false);
  const [showQuizChoice, setShowQuizChoice] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && offerId) {
      checkOfferQuizzes();
    }
  }, [isOpen, offerId]);

  const checkOfferQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7001/api/quiz/offer/${offerId}/check`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok && data.hasQuiz) {
        setHasQuiz(true);
        setShowQuizChoice(true);
      } else {
        // No quiz available, just close
        onClose();
      }
    } catch (error) {
      console.error('Error checking quizzes:', error);
      onClose();
    }
  };

  const startRandomQuiz = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7001/api/quiz/offer/${offerId}/random`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to load quiz");
        return;
      }

      const data = await response.json();
      setCurrentQuiz(data.quiz);
      setQuestions(data.questions);
      setShowQuizChoice(false);
      setAnswers({});
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.warning("Please answer all questions");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const response = await fetch(`http://localhost:7001/api/quiz-answers/${currentQuiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Quiz submitted successfully! Your score: " + result.quizAnswer.totalScore);
        handleClose();
      } else {
        toast.error(result.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasQuiz(false);
    setShowQuizChoice(false);
    setCurrentQuiz(null);
    setQuestions([]);
    setAnswers({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="quiz-popup-overlay" onClick={handleBackdropClick}>
      <div className="quiz-popup-container">
        <div className="quiz-popup-header">
          <h2>
            {showQuizChoice ? "Quiz Available!" : 
             currentQuiz ? `Quiz: ${currentQuiz.title}` : "Loading..."}
          </h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="quiz-popup-content">
          {showQuizChoice && (
            <div className="quiz-choice-section">
              <div className="quiz-info">
                <p>🎯 This offer has quizzes available!</p>
                <p>Taking a quiz can give you a quick response from the company and help you stand out from other candidates.</p>
              </div>
              <div className="quiz-actions">
                <button 
                  className="btn-quiz-random" 
                  onClick={startRandomQuiz}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Take Random Quiz"}
                </button>
                <button className="btn-skip" onClick={handleClose}>
                  Skip Quiz
                </button>
              </div>
            </div>
          )}

          {currentQuiz && questions.length > 0 && (
            <div className="quiz-section">
              <div className="quiz-description">
                {currentQuiz.description && (
                  <p className="quiz-desc">{currentQuiz.description}</p>
                )}
                <p className="quiz-meta">
                  {questions.length} questions • 
                  Total Points: {questions.reduce((sum, q) => sum + q.score, 0)}
                </p>
              </div>

              <div className="questions-container">
                {questions.map((question, index) => (
                  <div key={question._id} className="question-card">
                    <div className="question-header">
                      <h4>Question {index + 1}</h4>
                      <span className="question-score">{question.score} pts</span>
                    </div>
                    <p className="question-text">{question.text}</p>
                    
                    <div className="answers-grid">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="answer-option">
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            checked={answers[question._id] === option}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          />
                          <span className="answer-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="quiz-submit-section">
                <div className="progress-info">
                  Answered: {Object.keys(answers).length} / {questions.length}
                </div>
                <button 
                  className="btn-submit-quiz"
                  onClick={submitQuiz}
                  disabled={submitting || Object.keys(answers).length !== questions.length}
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;