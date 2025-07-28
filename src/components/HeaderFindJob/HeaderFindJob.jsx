import React, { useState, useEffect } from 'react';
import './HeaderFindJob.css';
import { companies, jobs } from '../../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';



// ✅ Helper function to calculate time since job was posted
const timeSincePost = (jobDate) => {
  const now = new Date();
  const posted = new Date(jobDate);
  const diffInMs = now - posted;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const rotatingWords = ["scope", "culture", "manager", "colleagues"];

const HeaderFindJob = () => {
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [showJobTypes, setShowJobTypes] = useState(false);
  const [results, setResults] = useState([]);
  const [sortOption, setSortOption] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const enrichedJobs = jobs.map(job => {
      const company = companies.find(c => c.id === job.companyId);
      return { ...job, company };
    });


    const filtered = enrichedJobs.filter(job => {
      const keywordMatch =
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.description.toLowerCase().includes(searchTerm.toLowerCase());

      const locationMatch = locationFilter === '' ||
        job.company.location.toLowerCase().includes(locationFilter.toLowerCase());

      const jobTypeMatch = jobTypeFilter.length === 0 ||
        jobTypeFilter.includes(job.jobType.toLowerCase());

      return keywordMatch && locationMatch && jobTypeMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.jobDate);
      const dateB = new Date(b.jobDate);

      switch (sortOption) {
        case 'salary':
          return b.jobSalary - a.jobSalary;
        case 'date':
          return dateB - dateA;
        case 'salary-date':
          if (b.jobSalary !== a.jobSalary) {
            return b.jobSalary - a.jobSalary;
          } else {
            return dateB - dateA;
          }
        default:
          return 0;
      }
    });

    setResults(sorted);
  }, [searchTerm, locationFilter, jobTypeFilter, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = results.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(results.length / jobsPerPage);

  const toggleJobType = (type) => {
    setJobTypeFilter(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getJobTypeClass = (jobType) => {
    switch (jobType.toLowerCase()) {
      case 'full-time': return 'job-type-full-time';
      case 'part-time': return 'job-type-part-time';
      case 'internship': return 'job-type-internship';
      default: return '';
    }
  };

  const getJobTypeIcon = (jobType) => {
    switch (jobType.toLowerCase()) {
      case 'full-time': return '💼';
      case 'part-time': return '⏰';
      case 'internship': return '🎓';
      default: return '📋';
    }
  };
  //save job offer function
  const toggleSaveJob = (jobId) => {
  setSavedJobs((prev) =>
    prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
  );
};
//naviagte details page
const navigate = useNavigate();


  return (
    <div className="header-container">
      <h1 className="header-title">
        Find the job with the right <span className="highlighted-word">{rotatingWords[index]}</span>
      </h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by job, keyword, or company"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="City / Location"
          className="search-input"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <div className="job-type-dropdown">
          <div onClick={() => setShowJobTypes(!showJobTypes)} className="dropdown-label">
            Job type {jobTypeFilter.length > 0 && `(${jobTypeFilter.length})`}
          </div>
          {showJobTypes && (
            <div className="job-type-checkboxes">
              {["Internship", "Full-time", "Part-time"].map(type => (
                <label key={type}>
                  <input
                    type="checkbox"
                    value={type.toLowerCase()}
                    checked={jobTypeFilter.includes(type.toLowerCase())}
                    onChange={() => toggleJobType(type.toLowerCase())}
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      

      {/* Results */}
      <div className="results-container">
        {results.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No jobs found</h3>
            <p className="no-results-text">Try adjusting your search criteria or browse all available positions</p>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h2 className="results-title">{results.length} Job{results.length !== 1 ? 's' : ''} Found</h2>
              <p className="results-subtitle">Showing results for your search criteria</p>
            </div>

{/* Sort Dropdown (outside search bar) */}
      <div className="sort-controls">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          className="sort-dropdown"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Default</option>
          <option value="salary">Highest Salary</option>
          <option value="date">Newest Jobs</option>
          <option value="salary-date">Highest Salary & Newest</option>
        </select>
      </div>
            <div className="job-cards-grid">
              {currentJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="cover-wrapper">
                    <img
                      src={job.company.cover}
                      alt={`${job.company.name} cover`}
                      className="cover-img"
                    />
                  </div>

                  <div className="company-section">
                    <div className="logo-wrapper">
                      <img
                        src={job.company.logo}
                        alt={`${job.company.name} logo`}
                        className="company-logo"
                      />
                    </div>
                    <div>
                      <h3 className="company-name">{job.company.name}</h3>
                      <div className="company-location">📍 {job.company.location}</div>
                    </div>
                  </div>

                  <div className="job-content">
                    <h4 className="job-title">{job.jobTitle}</h4>
                    <div className="job-meta">
                      <span className={`job-type-badge ${getJobTypeClass(job.jobType)}`}>
                        {getJobTypeIcon(job.jobType)} {job.jobType}
                      </span>
                      <span className="slots-badge">👥 {job.jobSlots} slot{job.jobSlots !== 1 ? 's' : ''}</span>
                      <span className="posted-time">📅 {timeSincePost(job.jobDate)}</span>
                    </div>
                  </div>

                  <div className="job-footer">
                    <div>
                      <div className="salary">{job.jobSalary.toLocaleString()} TND /month</div>
                    </div>
                    <button
                    className="apply-button"
                    onClick={() => navigate(`/find-job/details/${job.id}`)}
                    >
                      More Details
                    </button>

                    
                    <button
                     className={`bookmark-btn ${savedJobs.includes(job.id) ? 'active' : ''}`}
                      onClick={() => toggleSaveJob(job.id)}
                      title={savedJobs.includes(job.id) ? 'Unsave' : 'Save'}
                    >
                    <FontAwesomeIcon icon={savedJobs.includes(job.id) ? solidBookmark : regularBookmark} />
                    </button>


                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="prev"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={currentPage === idx + 1 ? 'active' : ''}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="next"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderFindJob;
