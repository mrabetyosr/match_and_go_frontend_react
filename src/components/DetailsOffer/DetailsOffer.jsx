import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./DetailsOffer.css";

const DetailsOffer = ({ offerId, onClose }) => {
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!offerId) return;
    if (!token) {
      toast.error("You need to sign in");
      navigate("/login");
      return;
    }
    fetchOfferDetails();
  }, [offerId, token, navigate]);

  const fetchOfferDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:7001/api/offers/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffer(res.data);
    } catch (error) {
      toast.error("Failed to fetch offer details");
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case "FullTime": return "#22c55e";
      case "PartTime": return "#f59e0b";
      case "Internship": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="offer-details-overlay" onClick={handleOverlayClick}>
        <div className="offer-details-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading offer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="offer-details-overlay" onClick={handleOverlayClick}>
        <div className="offer-details-container">
          <div className="error-container">
            <h2>Offer not found</h2>
            <button className="back-button" onClick={() => navigate("/application")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-details-overlay" onClick={handleOverlayClick}>
      <div className="offer-details-container">
        {/* Header */}
        <div className="offer-details-header">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <h1>{offer.jobTitle}</h1>
          <div 
            className="job-type-badge"
            style={{ backgroundColor: getJobTypeColor(offer.jobType) }}
          >
            {offer.jobType}
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="offer-details-content">
          {/* Informations principales */}
          <div className="offer-main-info">
            <div className="info-grid">
              <div className="info-card">
                <strong>Company</strong>
                <span>{offer.companyId?.username || offer.companyId?.email || "N/A"}</span>

              </div>
              <div className="info-card">
                <strong>Slots</strong>
                <span>{offer.jobSlots}</span>
              </div>
              <div className="info-card">
                <strong>Remote</strong>
                <span>{offer.remote ? "Yes" : "No"}</span>
              </div>
              <div className="info-card">
                <strong>Salary</strong>
                <span>${offer.jobSalary}</span>
              </div>
              <div className="info-card">
                <strong>Duration</strong>
                <span>{offer.duration || "N/A"}</span>
              </div>
              <div className="info-card">
                <strong>Deadline</strong>
                <span>
                  {offer.applicationDeadline 
                    ? new Date(offer.applicationDeadline).toLocaleDateString() 
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {offer.description && (
            <div className="offer-section">
              <h3 className="section-title">Description</h3>
              <div className="section-content">
                {offer.description}
              </div>
            </div>
          )}

          {/* Requirements */}
          {offer.requirements && offer.requirements.length > 0 && (
            <div className="offer-section">
              <h3 className="section-title">Requirements</h3>
              <div className="section-content">
                <div className="tags-container">
                  {offer.requirements.map((req, index) => (
                    <span key={index} className="tag">{req}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {offer.skills && offer.skills.length > 0 && (
            <div className="offer-section">
              <h3 className="section-title">Skills Required</h3>
              <div className="section-content">
                <div className="tags-container">
                  {offer.skills.map((skill, index) => (
                    <span key={index} className="tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages */}
          {offer.languages && offer.languages.length > 0 && (
            <div className="offer-section">
              <h3 className="section-title">Languages</h3>
              <div className="section-content">
                <div className="tags-container">
                  {offer.languages.map((lang, index) => (
                    <span key={index} className="tag">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {offer.responsibilities && offer.responsibilities.length > 0 && (
            <div className="offer-section">
              <h3 className="section-title">Responsibilities</h3>
              <div className="section-content">
                <div className="tags-container">
                  {offer.responsibilities.map((resp, index) => (
                    <span key={index} className="tag">{resp}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          {offer.benefits && offer.benefits.length > 0 && (
            <div className="offer-section">
              <h3 className="section-title">Benefits</h3>
              <div className="section-content">
                <div className="tags-container">
                  {offer.benefits.map((benefit, index) => (
                    <span key={index} className="tag">{benefit}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="offer-section">
            <div className="info-grid">
              {offer.experience && (
                <div className="info-card">
                  <strong>Experience</strong>
                  <span>{offer.experience}</span>
                </div>
              )}
              {offer.education && (
                <div className="info-card">
                  <strong>Education</strong>
                  <span>{offer.education}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsOffer;