import React, { useState } from 'react';
import { Calendar, X, Clock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import './ScheduleInterviewModal.css';

const ScheduleInterviewModal = ({ 
  isOpen, 
  onClose, 
  applicationId, 
  candidateName, 
  jobTitle,
  companyName,
  onInterviewScheduled 
}) => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Minimum selectable datetime (30 mins from now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0,16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date & time.');
    if (new Date(date) <= new Date()) return toast.error('Please select a future date.');

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:7001/api/interviews/schedule/${applicationId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ date })
      });

      if (res.ok) {
        toast.success('Interview scheduled successfully! Email & notification sent.');
        if (onInterviewScheduled) onInterviewScheduled(applicationId);
        setDate('');
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to schedule interview');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content schedule-interview-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-title-section">
            <Calendar className="modal-title-icon" />
            <div>
              <h2 className="modal-title">Schedule Interview</h2>
              <p className="modal-subtitle">
                <User className="inline-icon" /> {candidateName} - {jobTitle}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" disabled={loading} aria-label="Close">
            <X className="close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="interview-form">
          <div className="form-group">
            <label className="form-label"><Clock className="label-icon" /> Date & Time</label>
            <input 
              type="datetime-local" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              min={getMinDateTime()} 
              className="form-input" 
              required 
            />
          </div>

          {date && (
            <div className="interview-preview">
              <h4>Preview</h4>
              <div className="preview-item"><strong>Candidate:</strong> {candidateName}</div>
              <div className="preview-item"><strong>Job Title:</strong> {jobTitle}</div>
              <div className="preview-item"><strong>Scheduled At:</strong> {new Date(date).toLocaleString()}</div>
              <div className="preview-item"><strong>Company:</strong> {companyName}</div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-schedule" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
