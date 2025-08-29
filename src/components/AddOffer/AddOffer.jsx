import React from 'react';
import './AddOffer.css'; 
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddOffer = ({ token, onOfferAdded, onClose }) => {
  const [offer, setOffer] = useState({
    jobTitle: "",
    jobType: "Internship",
    remote: false,
    jobSalary: 0,
    duration: "",
    jobSlots: 1,
    jobDate: "",
    applicationDeadline: "",
    experience: "",
    education: "",
    languages: [],
    skills: [],
    tags: [],
    description: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
  });

  const handleChange = (field, value) => {
    setOffer({ ...offer, [field]: value });
  };

  const handleArrayChange = (field, value) => {
    setOffer({ ...offer, [field]: value.split(",").map(v => v.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:7001/api/offers/add", offer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Offer added successfully");
      onOfferAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add offer");
    }
  };

  return (
    <div className="add-offer-overlay">
      <div className="add-offer-modal">
        <div className="add-offer-header">
          <div className="header-content">
            <div className="offer-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <h2 className="modal-title">Create New Offer</h2>
              <p className="modal-subtitle">Fill in the details for your job posting</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-offer-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior React Developer"
                    value={offer.jobTitle}
                    onChange={(e) => handleChange("jobTitle", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select
                    className="form-select"
                    value={offer.jobType}
                    onChange={(e) => handleChange("jobType", e.target.value)}
                  >
                    <option value="Internship">Internship</option>
                    <option value="PartTime">Part Time</option>
                    <option value="FullTime">Full Time</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Available Slots *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1"
                    value={offer.jobSlots}
                    onChange={(e) => handleChange("jobSlots", e.target.value)}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Salary (Optional)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="50000"
                    value={offer.jobSalary}
                    onChange={(e) => handleChange("jobSalary", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={offer.remote}
                    onChange={(e) => handleChange("remote", e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Remote Work Available</span>
                </label>
              </div>
            </div>

            {/* Timeline */}
            <div className="form-section">
              <h3 className="section-title">Timeline</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 6 months, Permanent"
                    value={offer.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={offer.jobDate}
                    onChange={(e) => handleChange("jobDate", e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={offer.applicationDeadline}
                    onChange={(e) => handleChange("applicationDeadline", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="form-section">
              <h3 className="section-title">Requirements</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2-3 years, Entry level"
                    value={offer.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Education</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bachelor's degree in CS"
                    value={offer.education}
                    onChange={(e) => handleChange("education", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Languages</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="English, French, Arabic (comma separated)"
                    value={offer.languages.join(", ")}
                    onChange={(e) => handleArrayChange("languages", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="React, Node.js, MongoDB (comma separated)"
                    value={offer.skills.join(", ")}
                    onChange={(e) => handleArrayChange("skills", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="form-section">
              <h3 className="section-title">Job Details</h3>
              
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Remote, Flexible, Growth (comma separated)"
                  value={offer.tags.join(", ")}
                  onChange={(e) => handleArrayChange("tags", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe the role, company culture, and what makes this opportunity unique..."
                  value={offer.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Responsibilities</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Develop features, Code review, Team collaboration (comma separated)"
                  value={offer.responsibilities.join(", ")}
                  onChange={(e) => handleArrayChange("responsibilities", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="3+ years experience, React expertise (comma separated)"
                  value={offer.requirements.join(", ")}
                  onChange={(e) => handleArrayChange("requirements", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Benefits</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Health insurance, Flexible hours, Remote work (comma separated)"
                  value={offer.benefits.join(", ")}
                  onChange={(e) => handleArrayChange("benefits", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;