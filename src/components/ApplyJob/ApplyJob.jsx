import React from 'react';
import './ApplyJob.css';

import { useState } from 'react';

const ApplyJob = ({ isOpen, onClose, job, company }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    currentLocation: '',
    dateOfBirth: '',
    resume: null,
    linkedinUrl: '',
    githubUrl: '',
    motivationLetter: null,
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms of service');
      return;
    }

    console.log('Application submitted:', formData);
    // Handle form submission here
    alert('Application submitted successfully!');
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="apply-job-overlay" onClick={handleBackdropClick}>
      <div className={`apply-job-panel ${isOpen ? 'open' : ''}`}>
        <div className="apply-job-header">
          <h2>Apply for {job?.jobTitle}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="apply-job-content">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <section className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telephone">Telephone Number *</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentLocation">Current Living Location *</label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Your Profile */}
            <section className="form-section">
              <h3>Your Profile</h3>
              
              <div className="form-group">
                <label htmlFor="resume">Upload Your Resume *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <div className="file-upload-placeholder">
                    {formData.resume ? formData.resume.name : 'Choose file or drag and drop'}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="linkedinUrl">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="githubUrl">GitHub Profile URL</label>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="motivationLetter">Letter of Motivation</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="motivationLetter"
                    name="motivationLetter"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="file-upload-placeholder">
                    {formData.motivationLetter ? formData.motivationLetter.name : 'Choose file or drag and drop (Optional)'}
                  </div>
                </div>
              </div>
            </section>

            {/* Terms of Service */}
            <section className="form-section">
              <div className="terms-section">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">
                    I agree to the <a href="#" target="_blank">Terms of Service</a> and consent to the processing of my personal data for recruitment purposes.
                  </span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;