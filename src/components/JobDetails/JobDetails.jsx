"use client"

import React, { useState, useEffect } from 'react';
import './JobDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import ApplyJob from '../ApplyJob/ApplyJob.jsx';
import QuizDrawer from '../QuizDrawer/QuizDrawer.jsx';
import QuizPopup from '../QuizPopup/QuizPopup.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Hook navigation
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [showQuizDrawer, setShowQuizDrawer] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  // Quiz states
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // Start quiz
  const handleStartQuiz = (quiz, questions) => {
    setCurrentQuiz(quiz);
    setCurrentQuestions(questions);
    setShowQuizDrawer(true);
  };

  // Fetch job details & saved jobs
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/api/offers/${id}`);
        const offer = response.data;
        setJob(offer);
        setCompany(offer.companyId);
        setLoading(false);

        // Fetch saved jobs
        const token = localStorage.getItem('token');
        if (token) {
          const savedRes = await axios.get('http://localhost:7001/api/users/saved-jobs', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSavedJobs(savedRes.data.savedJobs || []);
        }
      } catch (err) {
        setError('Failed to fetch job details.');
        setLoading(false);
        toast.error("⚠️ Failed to fetch job details.");
      }
    };

    fetchJobDetails();
  }, [id]);

  // Apply now
  const handleApplyNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning("⚠️ You need to sign in first!");
      setShowSignIn(true);
      return;
    }
    setShowApplicationForm(true);
  };

  const handleCloseApplication = () => setShowApplicationForm(false);
  const handleCloseSignIn = () => setShowSignIn(false);

  // Application submitted
  const handleApplicationSubmitted = () => {
    setShowApplicationForm(false);
    toast.success("Application submitted successfully! 🎉");
    setShowQuizPopup(true);
  };

  const handleCloseQuizPopup = () => setShowQuizPopup(false);
  const handleCloseQuizDrawer = () => {
    setShowQuizDrawer(false);
    setCurrentQuiz(null);
    setCurrentQuestions([]);
  };

  // Save / Unsave job with toast
  const toggleSaveJob = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning("⚠️ You need to sign in to save jobs.");
      setShowSignIn(true);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:7001/api/users/save-job/${job._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedJobs(res.data.savedJobs);
      const isSaved = res.data.savedJobs.includes(job._id);
      toast[isSaved ? 'success' : 'info'](isSaved ? "Job saved successfully ✅" : "Job removed from saved list ❌");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save job. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error || !job || !company) return <p>{error || 'Job not found.'}</p>;

  const isSaved = savedJobs.includes(job._id);

  return (
    <div className="job-details-container">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />

      <img src={`http://localhost:7001/images/${company.cover_User}`} alt={`${company.username} cover`} />

      <div className="job-details-inner">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="company-header">
            <img src={`http://localhost:7001/images/${company.image_User}`} alt={`${company.username} logo`} />
            <h2>{company.username}</h2>
            <div className="company-info">
              <p>{company.companyInfo?.location || 'N/A'}</p>
              <p>{company.companyInfo?.category || 'N/A'}</p>
            </div>
          </div>

          <div className="job-summary-card">
            <h3>Job Summary</h3>
            <div className="summary-item">
              <span className="summary-label">Contract</span>
              <span className="summary-value">{job.contractType || job.jobType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Location</span>
              <span className="summary-value">
                {company.companyInfo?.location} {job.remote && "(Remote)"}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Salary</span>
              <span className="summary-value">{job.jobSalary ? `${job.jobSalary} TND/month` : 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Experience</span>
              <span className="summary-value">{job.experience}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Education</span>
              <span className="summary-value">{job.education}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Posted</span>
              <span className="summary-value">{new Date(job.jobDate).toDateString()}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleApplyNow}>Apply Now</button>
            <button onClick={toggleSaveJob}>
              <FontAwesomeIcon icon={isSaved ? solidBookmark : regularBookmark} /> {isSaved ? "Unsave Job" : "Save Job"}
            </button>
            <button 
              onClick={() => navigate(`/profile/${company._id}`)}
              className="profile-btn"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h1>{job.jobTitle}</h1>

          <section>
            <h3>Job Description</h3>
            <p>{job.description || 'No description available.'}</p>
          </section>

          <section>
            <h3>Skills & Expertise</h3>
            {job.skills?.length ? (
              <div className="skills-container">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            ) : <p className="no-data">No skills listed.</p>}
          </section>

          <section>
            <h3>Key Responsibilities</h3>
            {job.responsibilities?.length ? (
              <ul>{job.responsibilities.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
            ) : <p className="no-data">No responsibilities listed.</p>}
          </section>

          <section>
            <h3>Requirements</h3>
            {job.requirements?.length ? (
              <ul>{job.requirements.map((req, idx) => <li key={idx}>{req}</li>)}</ul>
            ) : <p className="no-data">No requirements listed.</p>}
          </section>
        </div>
      </div>

      {/* Modals */}
      <ApplyJob 
        isOpen={showApplicationForm}
        onClose={handleCloseApplication}
        job={job}
        company={company}
        onApplicationSubmitted={handleApplicationSubmitted}
      />
      <QuizPopup
        isOpen={showQuizPopup}
        onClose={handleCloseQuizPopup}
        offerId={job?._id}
        onStartQuiz={handleStartQuiz}
      />
      <QuizDrawer
        isOpen={showQuizDrawer}
        onClose={handleCloseQuizDrawer}
        quiz={currentQuiz}
        questions={currentQuestions}
      />
    </div>
  );
};

export default JobDetails;
