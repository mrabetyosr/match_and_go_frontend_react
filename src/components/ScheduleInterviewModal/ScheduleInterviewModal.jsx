import React, { useState } from 'react';
import { Calendar, Link, MessageSquare, X, Clock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import './ScheduleInterviewModal.css';

const ScheduleInterviewModal = ({ 
  isOpen, 
  onClose, 
  applicationId, 
  candidateName, 
  jobTitle,
  onInterviewScheduled 
}) => {
  const [formData, setFormData] = useState({
    date: '',
    meetLink: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.date || !formData.meetLink) {
      toast.error('Date and Meet link are required');
      return;
    }

    // Vérifier que la date est dans le futur
    const selectedDate = new Date(formData.date);
    const now = new Date();
    if (selectedDate <= now) {
      toast.error('Please select a future date and time');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:7001/api/interviews/${applicationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Interview scheduled successfully! Email sent to candidate.');
        
        // Callback pour mettre à jour l'application parent
        if (onInterviewScheduled) {
          onInterviewScheduled(applicationId);
        }
        
        // Reset form et fermer modal
        setFormData({ date: '', meetLink: '', message: '' });
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule interview');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const generateMeetLink = () => {
    // Générer un lien Google Meet basique
    const meetId = Math.random().toString(36).substring(2, 15);
    const generatedLink = `https://meet.google.com/${meetId}`;
    setFormData(prev => ({
      ...prev,
      meetLink: generatedLink
    }));
    toast.info('Google Meet link generated');
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Au moins 30 minutes dans le futur
    return now.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content schedule-interview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <Calendar className="modal-title-icon" />
            <div>
              <h2 className="modal-title">Schedule Interview</h2>
              <p className="modal-subtitle">
                <User className="inline-icon" />
                {candidateName} - {jobTitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="modal-close-btn"
            disabled={loading}
          >
            <X className="close-icon" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="interview-form">
          {/* Date and Time */}
          <div className="form-group">
            <label className="form-label">
              <Clock className="label-icon" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={getMinDateTime()}
              className="form-input"
              required
            />
          </div>

          {/* Meet Link */}
          <div className="form-group">
            <label className="form-label">
              <Link className="label-icon" />
              Google Meet Link
            </label>
            <div className="input-with-button">
              <input
                type="url"
                name="meetLink"
                value={formData.meetLink}
                onChange={handleInputChange}
                placeholder="https://meet.google.com/..."
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={generateMeetLink}
                className="generate-btn"
                disabled={loading}
              >
                Generate
              </button>
            </div>
            <small className="form-help">
              Enter a Google Meet link or click "Generate" for a random one
            </small>
          </div>

          {/* Message */}
          <div className="form-group">
            <label className="form-label">
              <MessageSquare className="label-icon" />
              Message to Candidate (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Add any additional information for the candidate..."
              className="form-textarea"
              rows="4"
            />
          </div>

          {/* Preview */}
          {formData.date && (
            <div className="interview-preview">
              <h4>Interview Preview</h4>
              <div className="preview-item">
                <strong>Date:</strong> {new Date(formData.date).toLocaleString()}
              </div>
              {formData.meetLink && (
                <div className="preview-item">
                  <strong>Link:</strong> 
                  <a href={formData.meetLink} target="_blank" rel="noopener noreferrer">
                    {formData.meetLink}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-schedule"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;