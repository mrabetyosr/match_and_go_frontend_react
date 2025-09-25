import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';

const QuizResponsesModal = ({ isOpen, onClose, applicationId, candidateName, quizSubmission }) => {
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen && applicationId && quizSubmission?.hasSubmitted) {
      fetchQuizDetails();
    }
  }, [isOpen, applicationId]);

  const fetchQuizDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:7001/api/quiz/my-results`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const data = await response.json();
      setQuizDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    if (percentage >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={24} color="#3b82f6" />
              Quiz Responses
            </h2>
            <p style={{
              color: '#6b7280',
              margin: '4px 0 0 0',
              fontSize: '0.875rem'
            }}>
              {candidateName}'s quiz submission details
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          maxHeight: 'calc(90vh - 80px)',
          overflowY: 'auto'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#6b7280', margin: 0 }}>Loading quiz details...</p>
            </div>
          ) : error ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#ef4444'
            }}>
              <XCircle size={48} style={{ margin: '0 auto 16px' }} />
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          ) : quizDetails ? (
            <div>
              {/* Quiz Summary */}
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <User size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Candidate</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: '600' }}>{candidateName}</p>
                  </div>
                  
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <Award size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Score</span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontWeight: '600',
                      color: getScoreColor(quizSubmission.percentage)
                    }}>
                      {quizSubmission.score}/{quizSubmission.totalPossibleScore} ({quizSubmission.percentage}%)
                    </p>
                  </div>
                  
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <Calendar size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Submitted</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: '600' }}>
                      {formatDate(quizSubmission.submittedAt)}
                    </p>
                  </div>
                  
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <Clock size={16} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Duration</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: '600' }}>
                      {quizDetails.timeTaken ? `${Math.round(quizDetails.timeTaken / 60)} minutes` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions and Answers */}
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Questions & Answers
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {quizDetails.responses?.map((response, index) => (
                    <div
                      key={index}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          backgroundColor: response.isCorrect ? '#dcfce7' : '#fee2e2',
                          color: response.isCorrect ? '#166534' : '#991b1b',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          minWidth: 'fit-content'
                        }}>
                          {response.isCorrect ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {response.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          Question {index + 1}
                        </span>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{
                          fontWeight: '600',
                          color: '#374151',
                          margin: '0 0 8px 0'
                        }}>
                          {response.question}
                        </p>
                      </div>
                      
                      <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}>
                            Candidate's Answer:
                          </span>
                          <p style={{
                            margin: '4px 0 0 0',
                            color: '#374151'
                          }}>
                            {response.selectedAnswer || 'No answer provided'}
                          </p>
                        </div>
                        
                        {!response.isCorrect && response.correctAnswer && (
                          <div>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#059669',
                              fontWeight: '500'
                            }}>
                              Correct Answer:
                            </span>
                            <p style={{
                              margin: '4px 0 0 0',
                              color: '#059669',
                              fontWeight: '500'
                            }}>
                              {response.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#6b7280'
                    }}>
                      <p>No detailed responses available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <Award size={48} style={{ margin: '0 auto 16px' }} />
              <p style={{ margin: 0 }}>No quiz submission found</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuizResponsesModal;