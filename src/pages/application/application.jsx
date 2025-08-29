import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import AddOffer from "../../components/AddOffer/AddOffer.jsx";
import AddQuiz from "../../components/AddQuiz/AddQuiz.jsx";
import EditOffer from "../../components/EditOffer/EditOffer.jsx";
import { useNavigate } from "react-router-dom";
import DetailsOffer from "../../components/DetailsOffer/DetailsOffer.jsx";
import "./application.css";

const Application = () => {
  const [offers, setOffers] = useState([]);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [showEditOffer, setShowEditOffer] = useState(false); // Nouvel état
  const [editingOffer, setEditingOffer] = useState(null); // Offre en cours d'édition
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    totalQuizzes: 0
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("You need to sign in");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      toast.error("Invalid token, please sign in again");
      return;
    }

    if (decoded.role !== "company") {
      toast.error("Only companies can access their offers");
      return;
    }

    fetchOffers();
  }, [token]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:7001/api/offers/myOffers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data.offers);
      
      // Calculate stats
      const totalOffers = res.data.offers.length;
      const activeOffers = res.data.offers.filter(offer => 
        new Date(offer.applicationDeadline) > new Date()
      ).length;
      const totalQuizzes = res.data.offers.reduce((sum, offer) => 
        sum + (offer.quizzes ? offer.quizzes.length : 0), 0
      );
      
      setStats({ totalOffers, activeOffers, totalQuizzes });
    } catch {
      toast.error("Failed to fetch offers");
    }
  };

  // Nouvelle fonction pour gérer l'édition
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setShowEditOffer(true);
  };

  // Fonction pour fermer le modal d'édition
  const handleCloseEditOffer = () => {
    setShowEditOffer(false);
    setEditingOffer(null);
  };

  // Ancienne fonction mise à jour (gardée pour compatibilité avec le menu)
  const handleUpdateOffer = async (id) => {
    const offer = offers.find(o => o._id === id);
    if (offer) {
      handleEditOffer(offer);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(`http://localhost:7001/api/offers/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Offer deleted successfully");
        fetchOffers();
      } catch {
        toast.error("Failed to delete offer");
      }
    }
  };

  const handleShowDetails = (offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  // Fonction pour fermer le modal des détails
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOffer(null);
  };

  const getJobTypeColor = (type) => {
    switch(type) {
      case 'FullTime': return '#22c55e';
      case 'PartTime': return '#f59e0b';
      case 'Internship': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="application-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Company Dashboard</h1>
          <p className="dashboard-subtitle">Manage your job offers and quizzes</p>
        </div>
        <button 
          className="add-offer-btn"
          onClick={() => setShowAddOffer(true)}
        >
          <span className="btn-icon">+</span>
          New Offer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total-offers"></div>
          <div className="stat-content">
            <h3>{stats.totalOffers}</h3>
            <p>Total Offers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active-offers"></div>
          <div className="stat-content">
            <h3>{stats.activeOffers}</h3>
            <p>Active Offers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total-quizzes"></div>
          <div className="stat-content">
            <h3>{stats.totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="offers-section">
        <h2 className="section-title">Your Job Offers</h2>
        
        {offers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>No offers yet</h3>
            <p>Create your first job offer to get started</p>
            <button 
              className="create-first-btn"
              onClick={() => setShowAddOffer(true)}
            >
              Create First Offer
            </button>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <div key={offer._id} className="offer-card">
                <div className="offer-header">
                  <div className="offer-title-section">
                    <h3 className="offer-title">{offer.jobTitle}</h3>
                    <div 
                      className="job-type-badge"
                      style={{ backgroundColor: getJobTypeColor(offer.jobType) }}
                    >
                      {offer.jobType}
                    </div>
                  </div>
                  <div className="offer-menu">
                    <button 
                      className="menu-btn"
                      onClick={() => handleUpdateOffer(offer._id)}
                    >
                      ⋯
                    </button>
                  </div>
                </div>

                <div className="offer-details">
                  <div className="detail-item">
                    <span className="detail-label">Slots:</span>
                    <span className="detail-value">{offer.jobSlots}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Remote:</span>
                    <span className={`remote-badge ${offer.remote ? 'remote-yes' : 'remote-no'}`}>
                      {offer.remote ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">
                      {offer.applicationDeadline ? 
                        new Date(offer.applicationDeadline).toLocaleDateString() : 
                        "N/A"
                      }
                    </span>
                  </div>
                  {offer.jobSalary > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value">${offer.jobSalary}</span>
                    </div>
                  )}
                </div>

                {/* Quizzes Section */}
                {offer.hasQuiz && offer.quizzes && offer.quizzes.length > 0 && (
                  <div className="quiz-section">
                    <h4 className="quiz-title">
                      Quizzes ({offer.quizzes.length})
                    </h4>
                    <div className="quiz-list">
                      {offer.quizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-item">
                          <span className="quiz-name">{quiz.title}</span>
                          <span className="quiz-questions">{quiz.nbrQuestions}Q</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="offer-actions">
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleEditOffer(offer)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn details"
                    onClick={() => handleShowDetails(offer)}
                  >
                    Details
                  </button>
                  <button
                    className="action-btn primary"
                    onClick={() => {
                      setCurrentOfferId(offer._id);
                      setShowAddQuiz(true);
                    }}
                  >
                    Add Quiz
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => handleDeleteOffer(offer._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddOffer && (
        <AddOffer
          token={token}
          onOfferAdded={fetchOffers}
          onClose={() => setShowAddOffer(false)}
        />
      )}

      {/* Nouveau modal EditOffer */}
      {showEditOffer && editingOffer && (
        <EditOffer
          token={token}
          offer={editingOffer}
          onOfferUpdated={fetchOffers}
          onClose={handleCloseEditOffer}
        />
      )}

      {showAddQuiz && currentOfferId && (
        <AddQuiz
          token={token}
          offerId={currentOfferId}
          onQuizAdded={fetchOffers}
          onClose={() => {
            setShowAddQuiz(false);
            setCurrentOfferId(null);
          }}
        />
      )}

      {/* Modal DetailsOffer */}
      {showDetailsModal && selectedOffer && (
        <DetailsOffer 
          offerId={selectedOffer._id} 
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default Application;