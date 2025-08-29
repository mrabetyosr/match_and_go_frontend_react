import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddQuiz.css';

const AddQuiz = ({ token, offerId, onQuizAdded, onClose }) => {
  const [quizData, setQuizData] = useState({
    title: "",
    durationSeconds: 300,
    nbrQuestions: 5,
  });

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return remainingSeconds > 0 
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }
    return `${seconds}s`;
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value);
    setQuizData({ ...quizData, durationSeconds: value });
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:7001/api/offers/${offerId}/quizzes`, quizData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quiz added successfully");
      setQuizData({ title: "", durationSeconds: 300, nbrQuestions: 5 });
      onQuizAdded();
      onClose();
    } catch {
      toast.error("Failed to add quiz");
    }
  };

  return (
    <div className="add-quiz-overlay">
      <div className="add-quiz-modal">
        <div className="add-quiz-header">
          <div className="header-content">
            <div className="quiz-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <h2 className="modal-title">Create Quiz</h2>
              <p className="modal-subtitle">Add a quiz to evaluate candidates</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddQuiz} className="add-quiz-form">
          <div className="form-content">
            <div className="quiz-preview">
              <div className="preview-header">
                <h3>Quiz Preview</h3>
                <div className="preview-stats">
                  <span className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {formatDuration(quizData.durationSeconds)}
                  </span>
                  <span className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11H15M9 15H15M17 21L12 16L7 21V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V21Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {quizData.nbrQuestions} Questions
                  </span>
                </div>
              </div>
              <div className="preview-card">
                <div className="preview-title">
                  {quizData.title || "Quiz Title Preview"}
                </div>
                <div className="preview-description">
                  This quiz will help evaluate candidates' skills and knowledge for the position.
                </div>
                <div className="preview-difficulty">
                  <span className="difficulty-badge">Assessment</span>
                </div>
              </div>
            </div>

            <div className="form-fields">
              <div className="form-section">
                <h3 className="section-title">Quiz Configuration</h3>
                
                <div className="form-group">
                  <label className="form-label">Quiz Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React Developer Assessment"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    required
                  />
                  <span className="form-hint">Give your quiz a descriptive title</span>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Number of Questions *</label>
                    <div className="input-with-controls">
                      <button 
                        type="button" 
                        className="control-btn minus"
                        onClick={() => setQuizData({ ...quizData, nbrQuestions: Math.max(1, quizData.nbrQuestions - 1) })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12H19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                      <input
                        type="number"
                        className="form-input-with-controls"
                        value={quizData.nbrQuestions}
                        onChange={(e) => setQuizData({ ...quizData, nbrQuestions: Math.max(1, parseInt(e.target.value) || 1) })}
                        min="1"
                        max="50"
                        required
                      />
                      <button 
                        type="button" 
                        className="control-btn plus"
                        onClick={() => setQuizData({ ...quizData, nbrQuestions: Math.min(50, quizData.nbrQuestions + 1) })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                    <span className="form-hint">Recommended: 5-15 questions</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration *</label>
                    <div className="duration-selector">
                      <input
                        type="range"
                        className="duration-slider"
                        min="60"
                        max="3600"
                        step="30"
                        value={quizData.durationSeconds}
                        onChange={handleDurationChange}
                      />
                      <div className="duration-display">
                        <span className="duration-value">{formatDuration(quizData.durationSeconds)}</span>
                        <div className="duration-presets">
                          <button 
                            type="button" 
                            className={`preset-btn ${quizData.durationSeconds === 300 ? 'active' : ''}`}
                            onClick={() => setQuizData({ ...quizData, durationSeconds: 300 })}
                          >
                            5m
                          </button>
                          <button 
                            type="button" 
                            className={`preset-btn ${quizData.durationSeconds === 600 ? 'active' : ''}`}
                            onClick={() => setQuizData({ ...quizData, durationSeconds: 600 })}
                          >
                            10m
                          </button>
                          <button 
                            type="button" 
                            className={`preset-btn ${quizData.durationSeconds === 900 ? 'active' : ''}`}
                            onClick={() => setQuizData({ ...quizData, durationSeconds: 900 })}
                          >
                            15m
                          </button>
                          <button 
                            type="button" 
                            className={`preset-btn ${quizData.durationSeconds === 1800 ? 'active' : ''}`}
                            onClick={() => setQuizData({ ...quizData, durationSeconds: 1800 })}
                          >
                            30m
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="form-hint">Choose appropriate time for your quiz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="footer-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Create Quiz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;