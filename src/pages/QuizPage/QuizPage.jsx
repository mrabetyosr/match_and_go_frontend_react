import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './QuizPage.css';

const QuizPage = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger le quiz au chargement de la page
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to take a quiz");
          navigate('/find-job');
          return;
        }

        const response = await fetch(`http://localhost:7001/api/quiz/${offerId}/random-quiz-with-questions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message || "Failed to load quiz");
          navigate('/find-job');
          return;
        }
        
        const data = await response.json();
        setQuiz(data.quiz);
        setQuestions(data.questions);
        
        // Démarrer le timer si nécessaire
        if (data.quiz.durationSeconds > 0) {
          setTimeLeft(data.quiz.durationSeconds);
          setQuizStarted(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz:', error);
        toast.error("Failed to load quiz");
        navigate('/find-job');
      }
    };

    if (offerId) {
      loadQuiz();
    }
  }, [offerId, navigate]);

  const handleSubmitQuiz = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
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
      
      // Rediriger vers la page d'accueil ou les offres
      navigate('/find-job');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, quiz?._id, navigate]);

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

  const handleExitQuiz = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
      navigate('/find-job');
    }
  };

  if (loading) {
    return (
      <div className="quiz-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!quiz || !questions || questions.length === 0) {
    return (
      <div className="quiz-page-error">
        <h2>Quiz not found</h2>
        <p>The quiz you're looking for is not available.</p>
        <button onClick={() => navigate('/find-job')} className="btn-back">
          Back to Jobs
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="quiz-page">
      <div className="quiz-page-container">
        {/* Header avec timer et titre */}
        <div className="quiz-page-header">
          <div className="quiz-title-section">
            <h1>{quiz.title}</h1>
            <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          
          <div className="quiz-controls-section">
            {quiz.durationSeconds > 0 && (
              <div className="timer-display">
                <span className="timer-icon">⏰</span>
                <span className="timer-text">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button onClick={handleExitQuiz} className="exit-quiz-btn">
              Exit Quiz
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{answeredQuestions}/{questions.length} questions answered</p>
        </div>

        {/* Navigation des questions */}
        <div className="question-navigation">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-nav-btn ${index === currentQuestionIndex ? 'active' : ''} ${
                answers[questions[index]._id] ? 'answered' : ''
              }`}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Question actuelle */}
        <div className="question-section">
          <div className="question-header">
            <h2>{currentQuestion.questionText}</h2>
            <div className="question-points">
              {currentQuestion.score} points
            </div>
          </div>

          <div className="answers-section">
            {currentQuestion.questionType === 'multiple-choice' && 
             currentQuestion.choices && currentQuestion.choices.map((choice, index) => (
              <label key={index} className="answer-choice">
                <input
                  type="radio"
                  name={`question_${currentQuestion._id}`}
                  value={choice}
                  checked={answers[currentQuestion._id] === choice}
                  onChange={() => handleAnswerChange(currentQuestion._id, choice)}
                />
                <span className="choice-text">{choice}</span>
              </label>
            ))}

            {currentQuestion.questionType === 'true-false' && (
              <div className="true-false-options">
                <label className="answer-choice">
                  <input
                    type="radio"
                    name={`question_${currentQuestion._id}`}
                    value="true"
                    checked={answers[currentQuestion._id] === 'true'}
                    onChange={() => handleAnswerChange(currentQuestion._id, 'true')}
                  />
                  <span className="choice-text">True</span>
                </label>
                <label className="answer-choice">
                  <input
                    type="radio"
                    name={`question_${currentQuestion._id}`}
                    value="false"
                    checked={answers[currentQuestion._id] === 'false'}
                    onChange={() => handleAnswerChange(currentQuestion._id, 'false')}
                  />
                  <span className="choice-text">False</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Navigation entre questions */}
        <div className="quiz-navigation">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            Previous
          </button>

          <div className="quiz-summary">
            <div className="summary-item">
              <span>Total Score: {quiz.totalScore} pts</span>
            </div>
            <div className="summary-item">
              <span>Progress: {Math.round(progress)}%</span>
            </div>
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || answeredQuestions === 0}
              className="submit-quiz-btn"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="nav-btn next-btn"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;