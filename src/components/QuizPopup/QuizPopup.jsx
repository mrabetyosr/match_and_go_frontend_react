import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './QuizPopup.css';

const QuizPopup = ({ isOpen, onClose, offerId }) => {
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkOfferQuizzes = React.useCallback(async () => {
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
  }, [offerId, onClose]);

  useEffect(() => {
    if (isOpen && offerId) {
      checkOfferQuizzes();
    }
  }, [isOpen, offerId, checkOfferQuizzes]);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      // Vérifier d'abord que le quiz est disponible
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7001/api/offers/${offerId}/quiz-availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        toast.error("Failed to verify quiz availability");
        return;
      }
      
      const data = await response.json();
      if (!data.hasQuiz) {
        toast.error("No quiz available for this offer");
        return;
      }
      
      // Fermer le popup et naviguer vers la page du quiz
      onClose();
      navigate(`/quiz/${offerId}`);
      
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error("Failed to start quiz");
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