import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EditQuiz.css';



const EditQuiz = ({ token, offerId, quizData: initialData, onQuizUpdated, onClose }) => {
  const [quizData, setQuizData] = useState({
    title: initialData.title || "",
    durationSeconds: initialData.durationSeconds || 300,
    nbrQuestions: initialData.nbrQuestions || 5,
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

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:7001/api/offers/${offerId}/quizzes/${initialData._id}`,
        quizData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Quiz updated successfully");
      onQuizUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update quiz");
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <div className="add-quiz-overlay">
      <div className="add-quiz-modal">
        <div className="add-quiz-header">
          <div className="header-content">
            <h2>Edit Quiz</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleUpdateQuiz} className="add-quiz-form">
          <div className="form-content">
            <div className="form-fields">
              <div className="form-section">
                <h3 className="section-title">Quiz Configuration</h3>
                
                <div className="form-group">
                  <label className="form-label">Quiz Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Number of Questions *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={quizData.nbrQuestions}
                      min="1"
                      max="50"
                      onChange={(e) => setQuizData({ ...quizData, nbrQuestions: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration *</label>
                    <input
                      type="range"
                      className="duration-slider"
                      min="60"
                      max="3600"
                      step="30"
                      value={quizData.durationSeconds}
                      onChange={handleDurationChange}
                    />
                    <div>{formatDuration(quizData.durationSeconds)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="footer-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Update Quiz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
