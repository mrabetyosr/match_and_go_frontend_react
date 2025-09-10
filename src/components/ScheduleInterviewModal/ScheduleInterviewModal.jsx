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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error('Date is required');
      return;
    }
    if (new Date(date) <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    setLoading(true);
    try {
      // Only send date; backend generates message and meet link
      const payload = { date };
      const res = await fetch(`http://localhost:7001/api/interviews/${applicationId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Interview scheduled successfully! Email sent to candidate.');
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

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0,16);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content schedule-interview-modal" onClick={e => e.stopPropagation()}>
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
          <button onClick={onClose} className="modal-close-btn" disabled={loading}><X className="close-icon" /></button>
        </div>

        <form onSubmit={handleSubmit} className="interview-form">
          <div className="form-group">
            <label className="form-label"><Clock className="label-icon" /> Date & Time</label>
            <input 
              type="datetime-local" 
              name="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              min={getMinDateTime()} 
              className="form-input" 
              required 
            />
          </div>

          {date && (
            <div className="interview-preview">
              <h4>Interview Preview</h4>
              <div className="preview-item"><strong>Date:</strong> {new Date(date).toLocaleString()}</div>
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
