"use client"

import { useState, useEffect, useRef } from "react"
import "./HeaderFindJob.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons"
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import HandLoader from "../HandLoader/HandLoader"

const timeSincePost = (jobDate) => {
  if (!jobDate) return "N/A"
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

// Default images - you can replace these with actual default image URLs
const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pgo8L3N2Zz4="

const DEFAULT_COVER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDMwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjM2NmYxO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9InVybCgjZ3JhZCkiLz4KPC9zdmc+"

const HeaderFindJob = () => {
  const [index, setIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState([])
  const [showJobTypes, setShowJobTypes] = useState(false)
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 3
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState({}) // Track image loading errors
  const navigate = useNavigate()
  
  // Ref for dropdown to handle outside clicks
  const dropdownRef = useRef(null)

  // Helper function to get safe image URL
  const getSafeImageUrl = (imageUrl, defaultImage, jobId = '', imageType = '') => {
    // If no URL provided, return default
    if (!imageUrl || imageUrl.trim() === '') {
      return defaultImage
    }

    // Check if this image has failed to load before
    const errorKey = `${jobId}_${imageType}`
    if (imageErrors[errorKey]) {
      return defaultImage
    }

    // For local images, check if it's a valid path
    if (imageUrl.includes('localhost:7001/images/')) {
      // If it's pointing to default files that might not exist
      if (imageUrl.includes('default.png') || imageUrl.includes('defaultCover.png')) {
        return defaultImage
      }
    }

    return imageUrl
  }

  // Handle image load errors
  const handleImageError = (jobId, imageType, event) => {
    console.log(`Image load error for ${imageType} in job ${jobId}`)
    
    // Mark this image as failed
    setImageErrors(prev => ({
      ...prev,
      [`${jobId}_${imageType}`]: true
    }))

    // Set fallback image
    if (imageType === 'logo') {
      event.target.src = DEFAULT_LOGO
    } else if (imageType === 'cover') {
      event.target.src = DEFAULT_COVER
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowJobTypes(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Rotating words animation
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % rotatingWords.length), 2000)
    return () => clearInterval(interval)
  }, [])

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:7001/api/offers/allOffers")
        const data = await res.json()
        const enriched = data.map((job) => {
          const companyId = job.companyId
          return {
            ...job,
            company: companyId
              ? {
                  name: companyId.username || "Unknown Company",
                  logo: companyId.image_User ? `http://localhost:7001/images/${companyId.image_User}` : "",
                  cover: companyId.cover_User ? `http://localhost:7001/images/${companyId.cover_User}` : "",
                  location: companyId.companyInfo?.location || "",
                  category: companyId.companyInfo?.category || "",
                  size: companyId.companyInfo?.size || "",
                  website: companyId.companyInfo?.website || "",
                  socialLinks: companyId.companyInfo?.socialLinks || {},
                }
              : {
                  name: "Unknown Company",
                  logo: "",
                  cover: "",
                  location: "",
                  category: "",
                  size: "",
                  website: "",
                  socialLinks: {},
                },
          }
        })
        setResults(enriched)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        toast.error("Failed to load jobs. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        const res = await fetch("http://localhost:7001/api/users/saved-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch saved jobs")
        const data = await res.json()
        setSavedJobs(data.savedJobs)
      } catch (err) {
        console.error("Error fetching saved jobs:", err)
      }
    }
    fetchSavedJobs()
  }, [])

  // Filter results
  const filteredResults = results.filter((job) => {
    const keywordMatch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const locationMatch =
      locationFilter === "" || job.company.location.toLowerCase().includes(locationFilter.toLowerCase())
    const jobTypeMatch = jobTypeFilter.length === 0 || jobTypeFilter.includes(job.jobType)
    return keywordMatch && locationMatch && jobTypeMatch
  })

  // Calculate pagination values
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / jobsPerPage))
  
  // Reset to first page when filters change or when current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [filteredResults.length, totalPages, currentPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, locationFilter, jobTypeFilter])

  // Calculate current jobs to display
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = Math.min(startIndex + jobsPerPage, filteredResults.length)
  const currentJobs = filteredResults.slice(startIndex, endIndex)

  // Toggle job type filter
  const toggleJobType = (type, event) => {
    // Prevent event bubbling to avoid closing dropdown
    event.stopPropagation()
    setJobTypeFilter((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setShowJobTypes(prev => !prev)
  }

  // Handle dropdown checkbox click
  const handleCheckboxClick = (event) => {
    // Prevent event bubbling
    event.stopPropagation()
  }

  // Get job type display name
  const getJobTypeDisplayName = (jobType) => {
    switch (jobType) {
      case "FullTime": return "Full Time"
      case "PartTime": return "Part Time"
      case "Internship": return "Internship"
      default: return jobType
    }
  }

  const getJobTypeClass = (jobType) => {
    switch (jobType) {
      case "FullTime": return "job-type-full-time"
      case "PartTime": return "job-type-part-time"
      case "Internship": return "job-type-internship"
      default: return ""
    }
  }

  const getJobTypeIcon = (jobType) => {
    switch (jobType) {
      case "FullTime": return "💼"
      case "PartTime": return "⏰"
      case "Internship": return "🎓"
      default: return "📋"
    }
  }

  // Toggle save job with toast
  const toggleSaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return toast.error("You must be logged in to save jobs.")

      const res = await fetch(`http://localhost:7001/api/users/save-job/${jobId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw new Error("Failed to toggle job")
      const data = await res.json()
      setSavedJobs(data.savedJobs)

      // Show toast
      if (data.savedJobs.includes(jobId)) {
        toast.success("Job saved!")
      } else {
        toast.info("Job removed from saved list")
      }
    } catch (err) {
      console.error("Error saving job:", err)
      toast.error("Error saving job. Please try again.")
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setJobTypeFilter([])
    setCurrentPage(1)
  }

  // Pagination handlers with bounds checking
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Generate page numbers for pagination
  const getVisiblePageNumbers = () => {
    const visiblePages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i)
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, currentPage + 2)
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5)
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i)
      }
    }
    
    return visiblePages
  }

  return (
    <div className="header-container">
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar 
        closeOnClick 
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
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
          aria-label="Search by job or company"
        />
        
        <input 
          type="text" 
          placeholder="City / Location" 
          className="search-input" 
          value={locationFilter} 
          onChange={(e) => setLocationFilter(e.target.value)}
          aria-label="Filter by location"
        />
        
        <div className="job-type-dropdown" ref={dropdownRef}>
          <div 
            onClick={handleDropdownToggle} 
            className="dropdown-label"
            role="button"
            aria-expanded={showJobTypes}
            aria-haspopup="true"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleDropdownToggle()
              }
            }}
          >
            <span>
              Job type {jobTypeFilter.length > 0 && `(${jobTypeFilter.length})`}
            </span>
            <FontAwesomeIcon 
              icon={showJobTypes ? faChevronUp : faChevronDown} 
              className="dropdown-icon"
            />
          </div>
          
          {showJobTypes && (
            <div className="job-type-checkboxes" role="menu">
              {["Internship", "FullTime", "PartTime"].map((type) => (
                <label 
                  key={type} 
                  className="checkbox-label"
                  onClick={handleCheckboxClick}
                  role="menuitem"
                >
                  <input 
                    type="checkbox" 
                    value={type} 
                    checked={jobTypeFilter.includes(type)} 
                    onChange={(e) => toggleJobType(type, e)}
                    onClick={handleCheckboxClick}
                  />
                  <span className="checkbox-text">
                    {getJobTypeDisplayName(type)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {(searchTerm || locationFilter || jobTypeFilter.length > 0) && (
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
            title="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-container">
        {loading ? (
          <div className="loading-container">
            <HandLoader size={100} />
            <p className="loading-text">Searching for the perfect jobs...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No jobs found</h3>
            <p className="no-results-text">
              Try adjusting your search criteria or browse all available positions
            </p>
            {(searchTerm || locationFilter || jobTypeFilter.length > 0) && (
              <button 
                className="clear-filters-btn secondary"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="results-header">
              <h2 className="results-title">
                {filteredResults.length} Job{filteredResults.length !== 1 ? "s" : ""} Found
              </h2>
              {(searchTerm || locationFilter || jobTypeFilter.length > 0) && (
                <p className="results-subtitle">
                  Showing results for your search criteria
                </p>
              )}
            </div>

            <div className="job-cards-grid">
              {currentJobs.map((job, cardIndex) => (
                <div 
                  key={job._id} 
                  className="job-card"
                  style={{ animationDelay: `${cardIndex * 0.1}s` }}
                >
                  <div className="cover-wrapper">
                    <img 
                      src={getSafeImageUrl(job.company.cover, DEFAULT_COVER, job._id, 'cover')} 
                      alt={`${job.company.name} cover`} 
                      className="cover-img"
                      onError={(e) => handleImageError(job._id, 'cover', e)}
                      onLoad={() => {
                        // Remove error state if image loads successfully
                        setImageErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors[`${job._id}_cover`]
                          return newErrors
                        })
                      }}
                    />
                  </div>

                  <div className="company-section">
                    <div className="logo-wrapper">
                      <img 
                        src={getSafeImageUrl(job.company.logo, DEFAULT_LOGO, job._id, 'logo')} 
                        alt={`${job.company.name} logo`} 
                        className="company-logo"
                        onError={(e) => handleImageError(job._id, 'logo', e)}
                        onLoad={() => {
                          // Remove error state if image loads successfully
                          setImageErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors[`${job._id}_logo`]
                            return newErrors
                          })
                        }}
                      />
                    </div>
                    <div className="company-info">
                      <h3 className="company-name">{job.company.name}</h3>
                      <div className="company-location">📍 {job.company.location || "Location not specified"}</div>
                      <div className="company-meta">
                        🏢 {job.company.category || "N/A"} | 👥 {job.company.size || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="job-content">
                    <h4 className="job-title">{job.jobTitle}</h4>
                    <div className="job-meta">
                      <span className={`job-type-badge ${getJobTypeClass(job.jobType)}`}>
                        {getJobTypeIcon(job.jobType)} {getJobTypeDisplayName(job.jobType)}
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
                    <div className="salary">
                      {job.jobSalary ? `${job.jobSalary.toLocaleString()} TND /month` : "Salary not specified"}
                    </div>
                    <div className="footer-actions">
                      <button 
                        className="apply-button" 
                        onClick={() => navigate(`/find-job/details/${job._id}`)}
                      >
                        More Details
                      </button>
                      <button
                        className={`bookmark-btn ${savedJobs.includes(job._id) ? "active" : ""}`}
                        onClick={() => toggleSaveJob(job._id)}
                        title={savedJobs.includes(job._id) ? "Click to Unsave" : "Click to Save"}
                        aria-label={savedJobs.includes(job._id) ? "Remove from saved jobs" : "Save job"}
                      >
                        <FontAwesomeIcon icon={savedJobs.includes(job._id) ? solidBookmark : regularBookmark} />
                      </button>
                    </div>
                  </div>

                  {(job.company.website || job.company.socialLinks?.linkedin) && (
                    <div className="company-links">
                      {job.company.website && (
                        <a 
                          href={job.company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Visit ${job.company.name} website`}
                        >
                          🌐 Website
                        </a>
                      )}
                      {job.company.socialLinks?.linkedin && (
                        <a 
                          href={job.company.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Visit ${job.company.name} LinkedIn profile`}
                        >
                          🔗 LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="prev" 
                  onClick={handlePreviousPage} 
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <span className="sr-only">Previous</span>
                </button>
                
                {getVisiblePageNumbers().map((pageNum) => (
                  <button 
                    key={pageNum} 
                    onClick={() => handlePageClick(pageNum)} 
                    className={currentPage === pageNum ? "active" : ""}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button 
                  className="next" 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span className="sr-only">Next</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HeaderFindJob