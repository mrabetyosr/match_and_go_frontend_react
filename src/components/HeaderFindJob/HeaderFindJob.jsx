"use client"

import { useState, useEffect } from "react"
import "./HeaderFindJob.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons"
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons"
import { useNavigate } from "react-router-dom"

const timeSincePost = (jobDate) => {
  const now = new Date()
  const posted = new Date(jobDate)
  const diffInMs = now - posted
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
}

const rotatingWords = ["scope", "culture", "manager", "colleagues"]

const HeaderFindJob = () => {
  const [index, setIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState([])
  const [showJobTypes, setShowJobTypes] = useState(false)
  const [results, setResults] = useState([])
  const [sortOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 3
  const [savedJobs, setSavedJobs] = useState([])
  const navigate = useNavigate()

  // Rotating words animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // 🔹 Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:7001/api/offers/allOffers")
        const data = await res.json()

        const enriched = data.map((job) => ({
          ...job,
          company: {
            name: job.companyId.username,
            logo: `http://localhost:7001/images/${job.companyId.image_User}`,
            cover: `http://localhost:7001/images/${job.companyId.cover_User}`,
            location: job.companyId.companyInfo?.location || "",
            category: job.companyId.companyInfo?.category || "",
            size: job.companyId.companyInfo?.size || "",
            website: job.companyId.companyInfo?.website || "",
            socialLinks: job.companyId.companyInfo?.socialLinks || {},
          },
        }))

        setResults(enriched)
      } catch (err) {
        console.error(err)
      }
    }

    fetchJobs()
  }, [])

  // Filter and sort results
  const filteredResults = results
    .filter((job) => {
      const keywordMatch =
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      const locationMatch =
        locationFilter === "" || job.company.location.toLowerCase().includes(locationFilter.toLowerCase())
      const jobTypeMatch = jobTypeFilter.length === 0 || jobTypeFilter.includes(job.jobType)
      return keywordMatch && locationMatch && jobTypeMatch
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "salary":
          return b.jobSalary - a.jobSalary
        case "date":
          return new Date(b.jobDate) - new Date(a.jobDate)
        case "salary-date":
          return b.jobSalary !== a.jobSalary ? b.jobSalary - a.jobSalary : new Date(b.jobDate) - new Date(a.jobDate)
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredResults.length / jobsPerPage)
  const currentJobs = filteredResults.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)

  const toggleJobType = (type) => {
    setJobTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const getJobTypeClass = (jobType) => {
    switch (jobType) {
      case "FullTime":
        return "job-type-full-time"
      case "PartTime":
        return "job-type-part-time"
      case "Internship":
        return "job-type-internship"
      default:
        return ""
    }
  }

  const getJobTypeIcon = (jobType) => {
    switch (jobType) {
      case "FullTime":
        return "💼"
      case "PartTime":
        return "⏰"
      case "Internship":
        return "🎓"
      default:
        return "📋"
    }
  }

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  return (
    <div className="header-container">
      <h1 className="header-title">
        Find the job with the right <span className="highlighted-word">{rotatingWords[index]}</span>
      </h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by job or company"
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
              {["Internship", "FullTime", "PartTime"].map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={jobTypeFilter.includes(type)}
                    onChange={() => toggleJobType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="results-container">
        {filteredResults.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No jobs found</h3>
            <p className="no-results-text">Try adjusting your search criteria or browse all available positions</p>
          </div>
        ) : (
          <>
            <div className="job-cards-grid">
              {currentJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="cover-wrapper">
                    <img src={job.company.cover} alt={`${job.company.name} cover`} className="cover-img" />
                  </div>

                  <div className="company-section">
                    <div className="logo-wrapper">
                      <img src={job.company.logo} alt={`${job.company.name} logo`} className="company-logo" />
                    </div>
                    <div>
                      <h3 className="company-name">{job.company.name}</h3>
                      <div className="company-location">📍 {job.company.location}</div>
                      <div className="company-meta">
                        🏢 {job.company.category} | 👥 {job.company.size}
                      </div>
                    </div>
                  </div>

                  <div className="job-content">
                    <h4 className="job-title">{job.jobTitle}</h4>
                    <div className="job-meta">
                      <span className={`job-type-badge ${getJobTypeClass(job.jobType)}`}>
                        {getJobTypeIcon(job.jobType)} {job.jobType}
                      </span>
                      {job.remote && <span className="remote-badge">🏠 Remote</span>}
                      <span className="slots-badge">
                        👥 {job.jobSlots} slot{job.jobSlots !== 1 ? "s" : ""}
                      </span>
                      <span className="posted-time">📅 {timeSincePost(job.jobDate)}</span>
                    </div>
                    <div className="job-quick-reqs">
                      🎓 {job.education || "N/A"} | 🧠 {job.experience || "N/A"}
                    </div>
                  </div>

                  <div className="job-footer">
                    <div className="salary">{job.jobSalary?.toLocaleString()} TND /month</div>
                    <div className="footer-actions">
                      <button className="apply-button" onClick={() => navigate(`/find-job/details/${job._id}`)}>
                        More Details
                      </button>
                      <button
                        className={`bookmark-btn ${savedJobs.includes(job._id) ? "active" : ""}`}
                        onClick={() => toggleSaveJob(job._id)}
                        title={savedJobs.includes(job._id) ? "Click to Unsave" : "Click to Save"}
                      >
                        <FontAwesomeIcon icon={savedJobs.includes(job._id) ? solidBookmark : regularBookmark} />
                      </button>
                    </div>
                  </div>

                  {job.company.website && (
                    <div className="company-links">
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                        🌐 Website
                      </a>
                      {job.company.socialLinks?.linkedin && (
                        <a href={job.company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          🔗 LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                className="prev"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={currentPage === idx + 1 ? "active" : ""}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="next"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HeaderFindJob
