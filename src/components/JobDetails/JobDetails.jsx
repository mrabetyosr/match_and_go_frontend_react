import React from 'react';
import './JobDetails.css';
import { useParams } from 'react-router-dom';
import { jobs, companies } from '../../assets/assets';

const JobDetails = () => {
  const { id } = useParams();
  const jobId = parseInt(id);
  const job = jobs.find(j => j.id === jobId);
  const company = companies.find(c => c.id === job?.companyId);

  if (!job || !company) return <p>Job not found.</p>;

  return (
    <div className="job-details-container">
      <img
        src={company.cover}
        alt="Company Cover"
      />

      <div>
        {/* Right Sidebar */}
        <div className="sidebar">
          <div className="company-header">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
            />
            <h2>{company.name}</h2>
          </div>

          <div className="job-summary-card">
            <h3>Job Summary</h3>
            <div className="summary-item">
              <span className="summary-label">Contract</span>
              <span className="summary-value">{job.contractType || job.jobType || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Location</span>
              <span className="summary-value">{company.location || 'N/A'} {job.remote ? "(Remote)" : ""}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Salary</span>
              <span className="summary-value">{job.jobSalary ? `${job.jobSalary} TND/month` : 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Experience</span>
              <span className="summary-value">{job.experience || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Education</span>
              <span className="summary-value">{job.education || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Posted</span>
              <span className="summary-value">{job.jobDate ? new Date(job.jobDate).toDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button>Apply Now</button>
            <button>Save Job</button>
          </div>
        </div>

        {/* Left Main Content */}
        <div className="main-content">
          <h1>{job.jobTitle}</h1>

          <section>
            <h3>Job Description</h3>
            <p>{job.description || 'No description available.'}</p>
          </section>

          <section>
            <h3>Skills & Expertise</h3>
            <ul>
              {(job.skills || []).map((skill, index) => (
                <li key={index}>✅ {skill}</li>
              ))}
              {(!job.skills || job.skills.length === 0) && <li>No skills listed.</li>}
            </ul>
          </section>

          <section>
            <h3>Responsibilities</h3>
            <ul>
              {(job.responsibilities || []).map((item, index) => (
                <li key={index}>📝 {item}</li>
              ))}
              {(!job.responsibilities || job.responsibilities.length === 0) && <li>No responsibilities listed.</li>}
            </ul>
          </section>

          <section>
            <h3>Requirements</h3>
            <ul>
              {(job.requirements || []).map((req, index) => (
                <li key={index}>📌 {req}</li>
              ))}
              {(!job.requirements || job.requirements.length === 0) && <li>No requirements listed.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;