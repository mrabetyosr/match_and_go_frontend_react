import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCandidateApplication.css";
import ViewCandidateCalender from "../ViewCandidateCalender/ViewCandidateCalender";
import ViewCandidateQuizResults from "../ViewCandidateQuizResults/ViewCandidateQuizResults";

// Loader spinner
const Loader = () => (
  <div className="vca-loader-container">
    <div className="vca-loader-spinner"></div>
  </div>
);

// Error message
const ErrorMessage = ({ message }) => (
  <div className="vca-error-container">
    <div className="vca-error-icon">⚠️</div>
    <p className="vca-error-message">{message}</p>
  </div>
);

// Stats card component
const StatsCard = ({ title, count, icon, colorClass }) => (
  <div className={`vca-stats-card ${colorClass}`}>
    <div className="vca-stats-content">
      <div className="vca-stats-text">
        <p className="vca-stats-title">{title}</p>
        <p className="vca-stats-count">{count}</p>
      </div>
      <div className="vca-stats-icon">
        <span className="vca-icon">{icon}</span>
      </div>
    </div>
  </div>
);

// Individual application card
const ApplicationCard = ({ app }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "pending": return "vca-status-pending";
      case "interview_scheduled": return "vca-status-interview";
      case "accepted": return "vca-status-accepted";
      case "rejected": return "vca-status-rejected";
      default: return "vca-status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "⏳";
      case "interview_scheduled": return "📅";
      case "accepted": return "✅";
      case "rejected": return "❌";
      default: return "⏳";
    }
  };

  return (
    <div className={`vca-application-card ${getStatusClass(app.status)}`}>
      <div className="vca-card-header">
        <h4 className="vca-job-title">{app.offerId.jobTitle}</h4>
        <div className={`vca-status-badge ${getStatusClass(app.status)}`}>
          <span className="vca-status-icon">{getStatusIcon(app.status)}</span>
          <span className="vca-status-text">{app.status}</span>
        </div>
      </div>

      <div className="vca-card-body">
        <div className="vca-company-info">
          {app.offerId.companyId.image_User ? (
            <img
              src={`http://localhost:7001/images/${app.offerId.companyId.image_User}`}
              alt={app.offerId.companyId.username}
              className="vca-company-image"
            />
          ) : (
            <div className="vca-company-placeholder">
              <span className="vca-building-icon">🏢</span>
            </div>
          )}
          <div className="vca-company-details">
            <p className="vca-company-name">{app.offerId.companyId.username}</p>
            <p className="vca-application-date">
              Applied on {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="vca-contact-info">
          <div className="vca-contact-item">
            <span className="vca-contact-icon">📧</span>
            <span className="vca-contact-text">{app.email}</span>
          </div>
          <div className="vca-contact-item">
            <span className="vca-contact-icon">📞</span>
            <span className="vca-contact-text">{app.phoneNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Group applications by status
const StatusGroup = ({ status, applications }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "⏳";
      case "interview_scheduled": return "📅";
      case "accepted": return "✅";
      case "rejected": return "❌";
      default: return "⏳";
    }
  };

  return (
    <div className="vca-status-section">
      <div className="vca-status-header">
        <span className="vca-status-icon-large">{getStatusIcon(status)}</span>
        <h2 className="vca-status-title">
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")} Applications ({applications.length})
        </h2>
      </div>

      {applications.length === 0 ? (
        <div className="vca-empty-state">
          <div className="vca-empty-icon">{getStatusIcon(status)}</div>
          <p className="vca-empty-message">No {status.replace("_", " ")} applications yet</p>
        </div>
      ) : (
        <div className="vca-cards-grid">
          {applications.map((app) => (
            <ApplicationCard key={app._id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component
const ViewCandidateApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const { data } = await axios.get(
          "http://localhost:7001/api/applications/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setApplications(data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  if (!applications.length) {
    return (
      <div className="vca-dashboard-container">
        <div className="vca-empty-dashboard">
          <div className="vca-empty-dashboard-icon">📋</div>
          <h2>No Applications Found</h2>
          <p>You haven't applied to any jobs yet. Start exploring opportunities!</p>
        </div>
      </div>
    );
  }

  const statuses = ["pending", "interview_scheduled", "accepted", "rejected"];
  const grouped = {};
  statuses.forEach((status) => {
    grouped[status] = applications.filter((app) => app.status === status);
  });

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: grouped["pending"].length,
    interviews: grouped["interview_scheduled"].length,
    accepted: grouped["accepted"].length,
    rejected: grouped["rejected"].length
  };

  return (
    <div className="vca-dashboard-container">
      {/* Statistics cards */}
      <div className="vca-stats-section">
        <div className="vca-stats-grid">
          <StatsCard title="Total Applications" count={stats.total} icon="📊" colorClass="vca-stats-total" />
          <StatsCard title="Pending" count={stats.pending} icon="⏳" colorClass="vca-stats-pending" />
          <StatsCard title="Interviews" count={stats.interviews} icon="📅" colorClass="vca-stats-interviews" />
          <StatsCard title="Accepted" count={stats.accepted} icon="✅" colorClass="vca-stats-accepted" />
          <StatsCard title="Rejected" count={stats.rejected} icon="❌" colorClass="vca-stats-rejected" />
        </div>
      </div>

      {/* Main content grid */}
      <div className="vca-main-grid">
        {/* Applications section */}
        <div className="vca-main-content">
          <div className="vca-applications-container">
            {statuses.map((status) => (
              <StatusGroup key={status} status={status} applications={grouped[status]} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="vca-sidebar">
          {/* Calendar section */}
          <div className="vca-sidebar-content">
            <div className="vca-sidebar-header">
              <span className="vca-sidebar-icon">📅</span>
              <h3>Upcoming Interviews</h3>
            </div>
            <div className="vca-calendar-container">
              <ViewCandidateCalender
                applications={applications.filter(a => a.status === "interview_scheduled")}
              />
            </div>
          </div>

          {/* Quiz Results section */}
          <div className="vca-sidebar-content vca-quiz-section">
            <div className="vca-sidebar-header">
              <span className="vca-sidebar-icon">🎯</span>
              <h3>Quiz Results</h3>
            </div>
            <div className="vca-quiz-container">
              <ViewCandidateQuizResults />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCandidateApplication;