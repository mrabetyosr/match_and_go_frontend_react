import React, { useEffect, useState } from "react";
import axios from "axios";
import './ViewCandidateQuizResults.css';

const ViewCandidateQuizResults = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:7001/api/quiz/my-results",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuizResults(data.results || []);
      } catch (err) {
        console.error('Error fetching quiz results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizResults();
  }, []);

  if (loading) return <p className="vcqr-loading">Loading quiz results...</p>;
  if (!quizResults.length) return <p className="vcqr-no-results">No quiz results found.</p>;

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScorePercentage = (score, totalScore) => {
    if (!totalScore || totalScore === 0) return 0;
    return Math.round((score / totalScore) * 100);
  };

  const getScoreClass = (percentage) => {
    if (percentage >= 80) return 'vcqr-score-excellent';
    if (percentage >= 60) return 'vcqr-score-good';
    if (percentage >= 40) return 'vcqr-score-average';
    return 'vcqr-score-poor';
  };

  return (
    <div className="vcqr-container">
  
      <div className="vcqr-results-list">
        {quizResults.map((result) => {
          // Utiliser la structure correcte selon votre backend
          const quiz = result.quiz;
          const totalScore = result.totalScore || quiz?.totalScore || 0;
          const userScore = result.totalScore || 0;
          const percentage = getScorePercentage(userScore, totalScore);
          
          return (
            <div key={result._id} className="vcqr-result-card">
              <div className="vcqr-card-header">
                <div className="vcqr-quiz-info">
                  <h4 className="vcqr-quiz-title">{quiz?.title || 'Quiz Title'}</h4>
                  <p className="vcqr-job-title">
                    💼 {quiz?.offer?.jobTitle || 'Job Title'}
                  </p>
                  <p className="vcqr-company-name">
                    🏢 {quiz?.offer?.companyId?.username || 'Company Name'}
                  </p>
                </div>
                <div className={`vcqr-score-badge ${getScoreClass(percentage)}`}>
                  <span className="vcqr-score-number">{userScore}</span>
                  <span className="vcqr-score-total">/ {totalScore}</span>
                  <span className="vcqr-score-percentage">({percentage}%)</span>
                </div>
              </div>

              <div className="vcqr-card-body">
                <div className="vcqr-details-grid">
                  <div className="vcqr-detail-item">
                    <span className="vcqr-detail-icon">📅</span>
                    <div className="vcqr-detail-content">
                      <span className="vcqr-detail-label">Submitted</span>
                      <span className="vcqr-detail-value">
                        {new Date(result.createdAt || result.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })} at {new Date(result.createdAt || result.submittedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="vcqr-detail-item">
                    <span className="vcqr-detail-icon">❓</span>
                    <div className="vcqr-detail-content">
                      <span className="vcqr-detail-label">Questions</span>
                      <span className="vcqr-detail-value">
                        {result.answers?.length || quiz?.nbrQuestions || 'N/A'} questions
                      </span>
                    </div>
                  </div>

                  <div className="vcqr-detail-item">
                    <span className="vcqr-detail-icon">⏱️</span>
                    <div className="vcqr-detail-content">
                      <span className="vcqr-detail-label">Duration</span>
                      <span className="vcqr-detail-value">
                        {formatDuration(quiz?.durationSeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="vcqr-detail-item">
                    <span className="vcqr-detail-icon">📊</span>
                    <div className="vcqr-detail-content">
                      <span className="vcqr-detail-label">Performance</span>
                      <span className={`vcqr-detail-value ${getScoreClass(percentage)}`}>
                        {percentage >= 80 ? 'Excellent' : 
                         percentage >= 60 ? 'Good' : 
                         percentage >= 40 ? 'Average' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>

                  <div className="vcqr-detail-item">
                    <span className="vcqr-detail-icon">✅</span>
                    <div className="vcqr-detail-content">
                      <span className="vcqr-detail-label">Correct Answers</span>
                      <span className="vcqr-detail-value">
                        {result.answers?.filter(answer => answer.isCorrect).length || 0} / {result.answers?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="vcqr-detail-item">
                    <span className="vcqr-detail-icon">🎯</span>
                    <div className="vcqr-detail-content">
                      <span className="vcqr-detail-label">Accuracy</span>
                      <span className={`vcqr-detail-value ${getScoreClass(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barre de progression du score */}
                <div className="vcqr-progress-container">
                  <div className="vcqr-progress-bar">
                    <div 
                      className={`vcqr-progress-fill ${getScoreClass(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCandidateQuizResults;