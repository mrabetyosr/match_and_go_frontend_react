import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './QuizPopup.css';

const QuizPopup = ({ isOpen, onClose, offerId, onStartQuiz }) => {
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && offerId) {
      checkOfferQuizzes();
    }
  }, [isOpen, offerId]);

  const checkOfferQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7001/api/offers/${offerId}/quiz-availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.hasQuiz) {
          setHasQuiz(true);
        } else {
          // Pas de quiz disponible
          onClose();
        }
      } else {
        console.error('Error checking quizzes, status:', response.status);
        onClose();
      }
    } catch (error) {
      console.error('Error checking quizzes:', error);
      onClose();
    }
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7001/api/offers/${offerId}/random-quiz`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to load quiz");
        return;
      }
      
      const data = await response.json();
      // Fermer le popup et ouvrir le drawer avec les données du quiz
      onClose();
      onStartQuiz(data.quiz, data.questions);
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !hasQuiz) return null;

  return (
    <div className="qap-modal-backdrop" onClick={handleBackdropClick}>
      <div className="qap-modal-wrapper">
        <div className="qap-header-section">
          <h2>🎯 Quiz Available!</h2>
          <button className="qap-close-button" onClick={onClose}>×</button>
        </div>

        <div className="qap-main-content">
          <div className="qap-info-section">
            <div className="qap-icon">
              <span className="qap-quiz-icon">📝</span>
            </div>
            <div className="qap-text-content">
              <p className="qap-main-text">
                This offer has quizzes available!
              </p>
              <p className="qap-sub-text">
                Taking a quiz can give you a quick response from the company and help you stand out from other candidates.
              </p>
            </div>
          </div>

          <div className="qap-action-buttons">
            
            <button 
              className="qap-btn-primary" 
              onClick={handleStartQuiz}
              disabled={loading}
            >
              {loading ? (
                <span className="qap-loading">
                  <span className="qap-spinner"></span>
                  Loading...
                </span>
              ) : (
                "Take Random Quiz"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;