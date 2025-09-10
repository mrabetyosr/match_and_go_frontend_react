import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { X, CheckCircle, Clock, Award } from 'lucide-react';
import './QuizDrawer.css';

const QuizDrawer = ({ isOpen, onClose, quiz, questions }) => {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

      const response = await fetch(`http://localhost:7001/api/quiz-answers/${quiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`Quiz submitted successfully! Your score: ${result.quizAnswer.totalScore}`);
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
    setAnswers({});
    setCurrentQuestionIndex(0);
    onClose();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const getQuestionStatus = (question) => {
    return answers[question._id] ? 'answered' : 'unanswered';
  };

  if (!isOpen || !quiz || !questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum, q) => sum + q.score, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className={`qd-drawer-overlay ${isOpen ? 'qd-open' : ''}`}>
      <div className="qd-drawer">
        {/* Header */}
        <div className="qd-header">
          <div className="qd-header-content">
            <h2 className="qd-title">{quiz.title}</h2>
            <button className="qd-close-btn" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          
          {quiz.description && (
            <p className="qd-description">{quiz.description}</p>
          )}
          
          <div className="qd-quiz-stats">
            <div className="qd-stat">
              <Clock size={16} />
              <span>{questions.length} Questions</span>
            </div>
            <div className="qd-stat">
              <Award size={16} />
              <span>{totalPoints} Total Points</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="qd-progress-section">
            <div className="qd-progress-info">
              <span>Progress: {answeredCount}/{questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="qd-progress-bar">
              <div 
                className="qd-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="qd-nav-section">
          <div className="qd-question-dots">
            {questions.map((question, index) => (
              <button
                key={question._id}
                className={`qd-dot ${index === currentQuestionIndex ? 'active' : ''} ${getQuestionStatus(question)}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <div className="qd-content">
          <div className="qd-question-section">
            <div className="qd-question-header">
              <span className="qd-question-number">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="qd-question-points">
                {currentQuestion.score} {currentQuestion.score === 1 ? 'pt' : 'pts'}
              </span>
            </div>
            
            <h3 className="qd-question-text">{currentQuestion.text}</h3>
            
            <div className="qd-options">
              {currentQuestion.options.map((option, optionIndex) => (
                <label 
                  key={optionIndex} 
                  className={`qd-option ${answers[currentQuestion._id] === option ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={option}
                    checked={answers[currentQuestion._id] === option}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  />
                  <span className="qd-option-text">{option}</span>
                  {answers[currentQuestion._id] === option && (
                    <CheckCircle size={20} className="qd-check-icon" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation & Submit */}
        <div className="qd-footer">
          <div className="qd-navigation">
            <button 
              className="qd-nav-btn qd-prev"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            
            <div className="qd-nav-center">
              {currentQuestionIndex === questions.length - 1 ? (
                <button 
                  className="qd-submit-btn"
                  onClick={submitQuiz}
                  disabled={submitting || answeredCount !== questions.length}
                >
                  {submitting ? (
                    <span className="qd-loading">
                      <span className="qd-spinner"></span>
                      Submitting...
                    </span>
                  ) : (
                    `Submit Quiz (${answeredCount}/${questions.length})`
                  )}
                </button>
              ) : (
                <button 
                  className="qd-nav-btn qd-next"
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDrawer;