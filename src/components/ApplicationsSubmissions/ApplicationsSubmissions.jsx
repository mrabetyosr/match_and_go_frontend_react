import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, FileText, Github, Linkedin, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ApplicationsSubmissions.css'; // Assuming you have a CSS file for styling

const ApplicationsSubmissions = ({ offerId, offerTitle, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(new Set());

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
        toast.success(`Application ${newStatus} successfully!`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update application status');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="status-icon" />;
      case 'rejected': return <XCircle className="status-icon" />;
      default: return <Clock className="status-icon" />;
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
                      <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
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
                      href={`http://localhost:7001/${application.cv}`} 
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
                      href={`http://localhost:7001/${application.motivationLetter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="doc-link cover-link"
                    >
                      <FileText className="doc-icon" />
                      Cover Letter
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

                {/* Action Buttons */}
                {application.status === 'pending' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => updateApplicationStatus(application._id, 'accepted')}
                      className={`action-btn accept-btn ${updatingStatus.has(application._id) ? 'loading' : ''}`}
                      disabled={updatingStatus.has(application._id)}
                    >
                      <CheckCircle className="btn-icon" />
                      {updatingStatus.has(application._id) ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(application._id, 'rejected')}
                      className={`action-btn reject-btn ${updatingStatus.has(application._id) ? 'loading' : ''}`}
                      disabled={updatingStatus.has(application._id)}
                    >
                      <XCircle className="btn-icon" />
                      {updatingStatus.has(application._id) ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsSubmissions;
