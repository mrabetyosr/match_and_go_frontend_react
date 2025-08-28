import React, { useState, useEffect } from 'react';
import './JobDetails.css';
import { useParams } from 'react-router-dom';
import ApplyJob from '../ApplyJob/ApplyJob.jsx';
import axios from 'axios';


const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/api/offers/${id}`);
        const offer = response.data;
        setJob(offer);
        setCompany(offer.companyId); // populate company info depuis backend
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job details.');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApplyNow = () => setShowApplicationForm(true);
  const handleCloseApplication = () => setShowApplicationForm(false);

  if (loading) return <p>Loading...</p>;
  if (error || !job || !company) return <p>{error || 'Job not found.'}</p>;

  return (
    <div className="job-details-container">
      <img src={company.cover} alt={`${company.username} cover`} />

      <div>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="company-header">
            <img src={company.image_User} alt={`${company.username} logo`} />
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
            <button>Save Job</button>
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
            ) : (
              <p className="no-data">No skills listed.</p>
            )}
          </section>

          <section>
            <h3>Key Responsibilities</h3>
            {job.responsibilities?.length ? (
              <ul>{job.responsibilities.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
            ) : (
              <p className="no-data">No responsibilities listed.</p>
            )}
          </section>

          <section>
            <h3>Requirements</h3>
            {job.requirements?.length ? (
              <ul>{job.requirements.map((req, idx) => <li key={idx}>{req}</li>)}</ul>
            ) : (
              <p className="no-data">No requirements listed.</p>
            )}
          </section>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplyJob 
        isOpen={showApplicationForm}
        onClose={handleCloseApplication}
        job={job}
        company={company}
      />
    </div>
  );
};

export default JobDetails;
