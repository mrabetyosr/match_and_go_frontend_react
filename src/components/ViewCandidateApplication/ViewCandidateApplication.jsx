import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCandidateApplication.css";

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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(data.applications);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

if (loading) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}  if (error) return <p>Error: {error}</p>;
  if (!applications.length) return <p>No applications found.</p>;

  // ✅ Group by status
  const grouped = {
    pending: applications.filter((app) => app.status === "pending"),
    accepted: applications.filter((app) => app.status === "accepted"),
    rejected: applications.filter((app) => app.status === "rejected"),
  };

  return (
    <div className="applications-container">
      <h2>My Applications</h2>

      {["pending", "accepted", "rejected"].map((status) => (
        <div key={status} className="status-group">
          <h3 style={{ textTransform: "capitalize" }}>{status}</h3>
          {grouped[status].length === 0 ? (
            <p>No {status} applications.</p>
          ) : (
            grouped[status].map((app) => (
              <div key={app._id} className="application-card">
                <h3>{app.offerId.jobTitle}</h3>
                <p><strong>Status:</strong> {app.status}</p>
                <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>

                <h4>Candidate Info</h4>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Phone:</strong> {app.phoneNumber}</p>
                <p><strong>Location:</strong> {app.location}</p>
                <p><strong>Date of Birth:</strong> {new Date(app.dateOfBirth).toLocaleDateString()}</p>

                <h4>Company Info</h4>
                <p><strong>Company Name:</strong> {app.offerId.companyId.username}</p>
                <p><strong>Location:</strong> {app.offerId.companyId.companyInfo.location}</p>
                {app.offerId.companyId.image_User && (
                  <img
                    src={`http://localhost:7001/images/${app.offerId.companyId.image_User}`}
                    alt={app.offerId.companyId.username}
                    className="company-image"
                  />
                )}

                <h4>Offer Details</h4>
                <p><strong>Description:</strong> {app.offerId.description}</p>
                <p><strong>Deadline:</strong> {new Date(app.offerId.applicationDeadline).toLocaleDateString()}</p>
                <hr />
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewCandidateApplication;
