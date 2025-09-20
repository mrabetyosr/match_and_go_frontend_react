import React, { useState, useEffect } from 'react';
import './ApplyJob.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizPopup from '../QuizPopup/QuizPopup';

const ApplyJob = ({ isOpen, onClose, job, company, onApplicationSubmitted }) => {
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showQuizPopup, setShowQuizPopup] = useState(false);

  // Fonction pour reset + fermer
  const handleClose = () => {
    setFormData(initialFormData);
    setShowQuizPopup(false);
    onClose();
  };

  // Fetch logged-in user's email
  useEffect(() => {
    if (!isOpen) return;

    // Reset form à l'ouverture
    setFormData({
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
    setShowQuizPopup(false);

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:7001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          return;
        }

        if (!res.ok) return;

        const user = await res.json();
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast.warning("Please agree to the terms of service");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to apply");
        return;
      }

      const data = new FormData();
      data.append("cv", formData.resume);
      if (formData.motivationLetter) data.append("motivationLetter", formData.motivationLetter);
      data.append("linkedin", formData.linkedinUrl);
      data.append("github", formData.githubUrl);
      data.append("phoneNumber", formData.telephone);
      data.append("location", formData.currentLocation);
      data.append("dateOfBirth", formData.dateOfBirth);

      const response = await fetch(`http://localhost:7001/api/applications/${job._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Error submitting application");
      } else {
        toast.success("Application submitted successfully!");
        
        // Vérifier s'il y a un quiz pour cette offre
        await checkAndHandleQuiz();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Fonction pour vérifier et gérer les quiz
  const checkAndHandleQuiz = async () => {
    console.log("Checking quiz availability for job:", job._id);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:7001/api/offers/${job._id}/quiz-availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Quiz availability data:", data);
        
        if (data.hasQuiz) {
          console.log("Quiz available! Opening quiz popup...");
          // Il y a un quiz disponible, afficher le popup quiz
          setShowQuizPopup(true);
        } else {
          console.log("No quiz available for this offer");
          // Pas de quiz, fermer le modal normalement
          handleClose();
        }
      } else {
        console.log("Error checking quiz availability, status:", response.status);
        // Erreur, fermer le modal normalement
        handleClose();
      }
    } catch (error) {
      console.error('Error checking quiz availability:', error);
      // En cas d'erreur, fermer le modal normalement
      handleClose();
    }
  };

  // Fonction appelée quand le quiz popup se ferme
  const handleQuizPopupClose = () => {
    setShowQuizPopup(false);
    handleClose(); // Fermer complètement l'application
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Application Form Modal */}
      <div className="apply-job-overlay" onClick={handleBackdropClick}>
        <div className={`apply-job-panel ${isOpen ? 'open' : ''}`}>
          <div className="apply-job-header">
            <h2>Apply for {job?.jobTitle}</h2>
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>

          <div className="apply-job-content">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <section className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input type="text" id="firstName" name="firstName"
                      value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input type="text" id="lastName" name="lastName"
                      value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telephone">Phone Number *</label>
                    <input type="tel" id="telephone" name="telephone"
                      value={formData.telephone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email"
                      value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currentLocation">Current Location *</label>
                    <input type="text" id="currentLocation" name="currentLocation"
                      value={formData.currentLocation} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth"
                      value={formData.dateOfBirth} onChange={handleInputChange} required />
                  </div>
                </div>
              </section>

              {/* Profile */}
              <section className="form-section">
                <h3>Your Profile</h3>
                <div className="form-group">
                  <label htmlFor="resume">Upload Resume *</label>
                  <div className="file-upload">
                    <input type="file" id="resume" name="resume"
                      onChange={handleInputChange} accept=".pdf,.doc,.docx" required />
                    <div className="file-upload-placeholder">
                      {formData.resume ? formData.resume.name : 'Choose file or drag and drop'}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="linkedinUrl">LinkedIn</label>
                    <input type="url" id="linkedinUrl" name="linkedinUrl"
                      value={formData.linkedinUrl} onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="githubUrl">GitHub</label>
                    <input type="url" id="githubUrl" name="githubUrl"
                      value={formData.githubUrl} onChange={handleInputChange}
                      placeholder="https://github.com/yourusername" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="motivationLetter">Motivation Letter</label>
                  <div className="file-upload">
                    <input type="file" id="motivationLetter" name="motivationLetter"
                      onChange={handleInputChange} accept=".pdf,.doc,.docx" />
                    <div className="file-upload-placeholder">
                      {formData.motivationLetter ? formData.motivationLetter.name : 'Choose file (optional)'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Terms */}
              <section className="form-section">
                <div className="terms-section">
                  <label className="checkbox-container">
                    <input type="checkbox" name="agreeToTerms"
                      checked={formData.agreeToTerms} onChange={handleInputChange} required />
                    <span className="checkmark"></span>
                    <span className="terms-text">
                      I agree to the Terms of Service and consent to data processing.
                    </span>
                  </label>
                </div>
              </section>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn-submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quiz Popup - s'affiche après soumission réussie si quiz disponible */}
      <QuizPopup
        isOpen={showQuizPopup}
        onClose={handleQuizPopupClose}
        offerId={job?._id}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ApplyJob;