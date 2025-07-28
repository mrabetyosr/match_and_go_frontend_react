import React, { useState } from 'react';
import './JobDetails.css';
import { useParams } from 'react-router-dom';
import { jobs, companies } from '../../assets/assets';
import ApplyJob from '../ApplyJob/ApplyJob.jsx';


const JobDetails = () => {
  const { id } = useParams();
  const jobId = parseInt(id);
  const job = jobs.find(j => j.id === jobId);
  const company = companies.find(c => c.id === job?.companyId);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (!job || !company) return <p>Job not found.</p>;

  const handleApplyNow = () => {
    setShowApplicationForm(true);
  };

  const handleCloseApplication = () => {
    setShowApplicationForm(false);
  };

  return (
    <div className="job-details-container">
      <img
        src={company.cover}
        alt={`${company.name} cover`}
      />

      <div>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="company-header">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
            />
            <h2>{company.name}</h2>
            <div className="company-info">
              <p>{company.location}</p>
              <p>{company.category}</p>
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
                {company.location} {job.remote && "(Remote)"}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Salary</span>
              <span className="summary-value">
                {job.jobSalary ? `${job.jobSalary} TND/month` : 'N/A'}
              </span>
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
              <span className="summary-value">
                {new Date(job.jobDate).toDateString()}
              </span>
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
            {job.skills && job.skills.length > 0 ? (
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
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <ul>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No responsibilities listed.</p>
            )}
          </section>

          <section>
            <h3>Requirements</h3>
            {job.requirements && job.requirements.length > 0 ? (
              <ul>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
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