
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Award,
  Medal,
  Trophy,
  Crown,
  Gem,
  Mail,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  BookOpen,
  Activity,
  ChevronRight,
} from "lucide-react"
import HandLoader from "../HandLoader/HandLoader"
import "./DetailsCandidateDash.css"

const DetailsCandidateDash = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidateDetails, setCandidateDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:7001/api/dashboard/admin/candidates/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCandidates(res.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Error fetching candidates")
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidateDetails = async (candidateId) => {
    try {
      setDetailsLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get(`http://localhost:7001/api/dashboard/admin/candidates/${candidateId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCandidateDetails(res.data)
    } catch (err) {
      console.error("Error fetching candidate details:", err)
      setError("Could not load candidate details")
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate)
    fetchCandidateDetails(candidate._id)
  }

  const getBadgeIcon = (badge) => {
    const icons = {
      "Bronze Applicant": <Award className="badge-icn bronze" />,
      "Silver Applicant": <Medal className="badge-icn silver" />,
      "Gold Applicant": <Trophy className="badge-icn gold" />,
      "Platinum Applicant": <Crown className="badge-icn platinum" />,
      "Diamond Applicant": <Gem className="badge-icn diamond" />,
    }
    return icons[badge] || <Award className="badge-icn" />
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="status-icon accepted" />
      case "rejected":
        return <XCircle className="status-icon rejected" />
      case "interview_scheduled":
        return <Calendar className="status-icon interview" />
      default:
        return <Clock className="status-icon pending" />
    }
  }

  const getStatusClass = (status) => {
    return `status-badge ${status}`
  }

  if (loading) return <HandLoader size={80} />
  if (error && !selectedCandidate) return <p style={{ color: "red" }}>{error}</p>
  if (!candidates.length) return <p>No candidates found</p>

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Candidates Management</h1>
          <p className="page-subtitle">View and manage all registered candidates</p>
        </div>
      </div>

      <div className="enhanced-cand-dashboard">
        <div className="cand-grid">
          {candidates.map((user) => (
            <div
              key={user._id}
              className={`cand-card ${selectedCandidate?._id === user._id ? "active" : ""}`}
              onClick={() => handleCandidateClick(user)}
            >
              <div className="cand-hdr">
                <img
                  src={user.image_User ? `http://localhost:7001/images/${user.image_User}` : "/user.png"}
                  alt={user.username}
                  className="cand-avt"
                />
                <div className="cand-info">
                  <h3>{user.username}</h3>
                  <p className="cand-email">
                    <Mail size={16} /> {user.email}
                  </p>
                  <span className="cand-role">
                    <Briefcase size={14} /> {user.role}
                  </span>
                </div>
              </div>

              {user.candidateInfo?.topBadge && (
                <div className="cand-top-badge">
                  {getBadgeIcon(user.candidateInfo.topBadge)}
                  <span>{user.candidateInfo.topBadge}</span>
                </div>
              )}

              {user.candidateInfo?.badges?.length > 0 && (
                <div className="cand-badges">
                  {user.candidateInfo.badges.map((badge, i) => (
                    <span key={i} className="badge-item">
                      {getBadgeIcon(badge)}
                    </span>
                  ))}
                </div>
              )}

              <div className="cand-quick-stats">
                <div className="stat-item">
                  <FileText size={16} />
                  <span>{user.applicationCount || 0} Apps</span>
                </div>
                <div className="stat-item">
                  <Target size={16} />
                  <span>{user.successRate || 0}% Success</span>
                </div>
              </div>

              {user.candidateInfo?.phoneNumber && (
                <div className="cand-contact">
                  <strong>Phone:</strong> {user.candidateInfo.phoneNumber}
                </div>
              )}
              {user.candidateInfo?.location && (
                <div className="cand-contact">
                  <strong>Location:</strong> {user.candidateInfo.location}
                </div>
              )}

              <div className="view-details">
                <span>View Details</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {selectedCandidate && (
          <div className="cand-details-panel">
            <div className="details-header">
              <div>
                <h2>{selectedCandidate.username}'s Activity</h2>
                <p className="subtitle">Detailed application history and performance</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="close-btn">
                ×
              </button>
            </div>

            {detailsLoading ? (
              <div className="details-loader">
                <HandLoader size={60} />
              </div>
            ) : candidateDetails ? (
              <div className="details-content">
                <div className="details-section">
                  <h3>
                    <Activity size={20} /> Application Overview
                  </h3>
                  <div className="overview-stats">
                    <div className="stat-box total">
                      <FileText size={24} />
                      <div>
                        <strong>{candidateDetails.stats?.totalApplications || 0}</strong>
                        <span>Total Applications</span>
                      </div>
                    </div>
                    <div className="stat-box accepted">
                      <CheckCircle size={24} />
                      <div>
                        <strong>{candidateDetails.stats?.accepted || 0}</strong>
                        <span>Accepted</span>
                      </div>
                    </div>
                    <div className="stat-box interview">
                      <Calendar size={24} />
                      <div>
                        <strong>{candidateDetails.stats?.interviews || 0}</strong>
                        <span>Interviews</span>
                      </div>
                    </div>
                    <div className="stat-box quiz">
                      <BookOpen size={24} />
                      <div>
                        <strong>{candidateDetails.stats?.quizzesTaken || 0}</strong>
                        <span>Quizzes Taken</span>
                      </div>
                    </div>
                  </div>

                  {candidateDetails.stats?.quizzesTaken > 0 && (
                    <div className="avg-score">
                      <TrendingUp size={18} />
                      <span>
                        Average Quiz Score: <strong>{candidateDetails.stats.averageQuizScore}%</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h3>
                    <FileText size={20} /> Application History ({candidateDetails.applications?.length || 0})
                  </h3>
                  {candidateDetails.applications?.length > 0 ? (
                    <div className="applications-list">
                      {candidateDetails.applications.map((app) => (
                        <div key={app._id} className="application-item">
                          <div className="app-header">
                            <div className="app-title">
                              <h4>{app.offerId?.jobTitle || "Unknown Position"}</h4>
                              <span className="company-name">
                                @ {app.offerId?.companyId?.username || "Unknown Company"}
                              </span>
                            </div>
                            {getStatusIcon(app.status)}
                          </div>

                          <div className="app-meta">
                            <span className={getStatusClass(app.status)}>
                              {app.status.replace("_", " ").toUpperCase()}
                            </span>
                            <span className="app-date">
                              Applied:{" "}
                              {new Date(app.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          {app.quizSubmission?.hasSubmitted && (
                            <div className="quiz-results">
                              <div className="quiz-header">
                                <BookOpen size={16} />
                                <strong>Quiz: {app.quizSubmission.quizTitle}</strong>
                              </div>
                              <div className="quiz-score">
                                <TrendingUp size={16} />
                                <span>
                                  Score: {app.quizSubmission.score}/{app.quizSubmission.totalPossibleScore}
                                </span>
                                <span className={`percentage ${app.quizSubmission.percentage >= 70 ? "good" : "low"}`}>
                                  {app.quizSubmission.percentage}%
                                </span>
                              </div>
                              <div className="quiz-date">
                                Submitted: {new Date(app.quizSubmission.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                          )}

                          <div className="app-documents">
                            {app.cv && (
                              <a
                                href={`http://localhost:7001/${app.cv}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="doc-link"
                              >
                                <FileText size={14} /> View CV
                              </a>
                            )}
                            {app.motivationLetter && (
                              <a
                                href={`http://localhost:7001/${app.motivationLetter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="doc-link"
                              >
                                <FileText size={14} /> Motivation Letter
                              </a>
                            )}
                          </div>

                          {(app.linkedin || app.github) && (
                            <div className="social-links">
                              {app.linkedin && (
                                <a href={app.linkedin} target="_blank" rel="noopener noreferrer">
                                  LinkedIn Profile
                                </a>
                              )}
                              {app.github && (
                                <a href={app.github} target="_blank" rel="noopener noreferrer">
                                  GitHub Profile
                                </a>
                              )}
                            </div>
                          )}

                          {(app.phoneNumber || app.location || app.email) && (
                            <div className="contact-info">
                              {app.email && <span>📧 {app.email}</span>}
                              {app.phoneNumber && <span>📱 {app.phoneNumber}</span>}
                              {app.location && <span>📍 {app.location}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No applications yet</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="no-data">No application data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailsCandidateDash
