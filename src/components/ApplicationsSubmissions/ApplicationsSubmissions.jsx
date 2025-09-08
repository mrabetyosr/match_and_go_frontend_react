import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, FileText, Github, Linkedin, Clock, CheckCircle, XCircle, ArrowLeft, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ApplicationsSubmissions.css';
import ScheduleInterviewModal from '../ScheduleInterviewModal/ScheduleInterviewModal';


const ApplicationsSubmissions = ({ offerId, offerTitle, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(new Set());
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchApplications();
  }, [offerId]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:7001/api/applications/${offerId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error('Failed to load applications');
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    if (updatingStatus.has(applicationId)) return;

    // Si le nouveau statut est "interview_scheduled", ouvrir le modal
    if (newStatus === 'interview_scheduled') {
      const application = applications.find(app => app._id === applicationId);
      setSelectedApplication(application);
      setScheduleModalOpen(true);
      return;
    }

    setUpdatingStatus(prev => new Set(prev).add(applicationId));

    try {
      const response = await fetch(`http://localhost:7001/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        toast.success(`Application ${newStatus.replace('_', ' ')} successfully!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update application status');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleInterviewScheduled = (applicationId) => {
    // Mettre à jour le statut de l'application à "interview_scheduled"
    setApplications(prev => prev.map(app => 
      app._id === applicationId ? { ...app, status: 'interview_scheduled' } : app
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'interview_scheduled': return 'status-interview';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="status-icon" />;
      case 'rejected': return <XCircle className="status-icon" />;
      case 'interview_scheduled': return <UserCheck className="status-icon" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'interview_scheduled': return 'Interview Scheduled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Fonction pour déterminer les actions possibles selon le statut actuel
  const getAvailableActions = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return [
          { action: 'interview_scheduled', label: 'Schedule Interview', icon: UserCheck, className: 'interview-btn' },
          { action: 'rejected', label: 'Reject', icon: XCircle, className: 'reject-btn' }
        ];
      case 'interview_scheduled':
        return [
          { action: 'accepted', label: 'Accept', icon: CheckCircle, className: 'accept-btn' },
          { action: 'rejected', label: 'Reject', icon: XCircle, className: 'reject-btn' }
        ];
      case 'accepted':
      case 'rejected':
        return []; 
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="applications-modal">
        <div className="applications-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-modal">
        <div className="applications-content">
          <div className="error-container">
            <p>Error: {error}</p>
            <button onClick={onClose} className="btn-close">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-modal">
      <div className="applications-content">
        {/* Header */}
        <div className="applications-header">
          <button onClick={onClose} className="back-btn">
            <ArrowLeft className="back-icon" />
            Back to Offers
          </button>
          <div className="header-info">
            <h2 className="applications-title">
              <User className="title-icon" />
              Applications for: {offerTitle}
            </h2>
            <p className="applications-count">{applications.length} applications received</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="applications-list">
          {applications.length === 0 ? (
            <div className="empty-applications">
              <User className="empty-icon" />
              <h3>No applications received</h3>
              <p>No candidates have applied to this offer yet.</p>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="application-card">
                {/* Candidate Header */}
                <div className="candidate-header">
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      <User className="avatar-icon" />
                    </div>
                    <div className="candidate-details">
                      <h3 className="candidate-name">
                        {application.candidateId?.username || 'Unknown Candidate'}
                      </h3>
                      <div className="candidate-email">
                        <Mail className="detail-icon" />
                        <span>{application.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="application-meta">
                    <div className={`status-badge ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span>{getStatusText(application.status)}</span>
                    </div>
                    <div className="application-date">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="contact-info">
                  {application.phoneNumber && (
                    <div className="contact-item">
                      <Phone className="contact-icon" />
                      <span>{application.phoneNumber}</span>
                    </div>
                  )}
                  
                  {application.location && (
                    <div className="contact-item">
                      <MapPin className="contact-icon" />
                      <span>{application.location}</span>
                    </div>
                  )}
                  
                  {application.dateOfBirth && (
                    <div className="contact-item">
                      <Calendar className="contact-icon" />
                      <span>{new Date(application.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Documents and Links */}
                <div className="documents-links">
                  {application.cv && (
                    <a 
                      href={`http://localhost:7001/images/${application.cv}`}  
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="doc-link cv-link"
                    >
                      <FileText className="doc-icon" />
                      Download CV
                    </a>
                  )}
                  
                  {application.motivationLetter && (
                    <a 
                      href={`http://localhost:7001/images/${application.motivationLetter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="doc-link cover-link"
                    >
                      <FileText className="doc-icon" />
                      Download Letter
                    </a>
                  )}
                  
                  {application.linkedin && (
                    <a 
                      href={application.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link linkedin-link"
                    >
                      <Linkedin className="social-icon" />
                      LinkedIn
                    </a>
                  )}
                  
                  {application.github && (
                    <a 
                      href={application.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link github-link"
                    >
                      <Github className="social-icon" />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Action Buttons - Logique dynamique selon le statut */}
                {(() => {
                  const availableActions = getAvailableActions(application.status);
                  
                  if (availableActions.length === 0) {
                    return (
                      <div className="status-final">
                        <span className="final-status-text">
                          {application.status === 'accepted' && '✅ Application accepted - Final decision'}
                          {application.status === 'rejected' && '❌ Application rejected - Final decision'}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div className="action-buttons">
                      {availableActions.map(({ action, label, icon: Icon, className }) => (
                        <button
                          key={action}
                          onClick={() => updateApplicationStatus(application._id, action)}
                          className={`action-btn ${className} ${updatingStatus.has(application._id) ? 'loading' : ''}`}
                          disabled={updatingStatus.has(application._id)}
                        >
                          <Icon className="btn-icon" />
                          {updatingStatus.has(application._id) ? `${label.split(' ')[0]}ing...` : label}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {/* Information sur les transitions possibles */}
                {application.status === 'pending' && (
                  <div className="transition-info">
                    <small className="text-muted">
                      💡 You can schedule an interview or reject this application
                    </small>
                  </div>
                )}
                
                {application.status === 'interview_scheduled' && (
                  <div className="transition-info">
                    <small className="text-muted">
                      💡 After the interview, you can accept or reject this candidate
                    </small>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Schedule Interview Modal */}
        {scheduleModalOpen && selectedApplication && (
          <ScheduleInterviewModal
            isOpen={scheduleModalOpen}
            onClose={() => {
              setScheduleModalOpen(false);
              setSelectedApplication(null);
            }}
            applicationId={selectedApplication._id}
            candidateName={selectedApplication.candidateId?.username || 'Unknown Candidate'}
            jobTitle={offerTitle}
            onInterviewScheduled={handleInterviewScheduled}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationsSubmissions;