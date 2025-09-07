import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCandidateApplication.css";

const Loader = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <p className="error-message">❌ {message}</p>
);

const ApplicationCard = ({ app }) => (
  <div className="application-card">
    <h4>{app.offerId.jobTitle}</h4>
    <p><strong>Status:</strong> {app.status}</p>
    <p><strong>Date:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>

    <p><strong>Email:</strong> {app.email}</p>
    <p><strong>Phone:</strong> {app.phoneNumber}</p>

    <p><strong>Company:</strong> {app.offerId.companyId.username}</p>
    {app.offerId.companyId.image_User && (
      <img
        src={`http://localhost:7001/images/${app.offerId.companyId.image_User}`}
        alt={app.offerId.companyId.username}
        className="company-image"
      />
    )}
  </div>
);

const StatusGroup = ({ status, applications }) => (
  <div className="status-group">
    <h3 className="status-title">{status}</h3>
    {applications.length === 0 ? (
      <p>No {status} applications.</p>
    ) : (
      <div className="cards-grid">
        {applications.map((app) => (
          <ApplicationCard key={app._id} app={app} />
        ))}
      </div>
    )}
  </div>
);

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
  if (!applications.length) return <p>No applications found.</p>;

  const grouped = {
    pending: applications.filter((app) => app.status === "pending"),
    accepted: applications.filter((app) => app.status === "accepted"),
    rejected: applications.filter((app) => app.status === "rejected"),
  };

  return (
    <div className="applications-container">
      <h2>My Applications</h2>
      <div className="status-grid">
        {["pending", "accepted", "rejected"].map((status) => (
          <StatusGroup
            key={status}
            status={status}
            applications={grouped[status]}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewCandidateApplication;
