import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DetailsCompanyDash.css';

const DetailsCompanyDash = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "Tech",
    "Advertising&Marketing",
    "Culture&Media",
    "Consulting&Audit",
    "Education&Training",
    "Finance&Banking"
  ];

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, categoryFilter, searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 3
      });
      
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(
        `http://localhost:7001/api/dashboard/admin/companies?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCompanies(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch companies');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:7001/api/dashboard/admin/companies/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedCompany(response.data.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching company details:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCompanies();
  };

  if (loading && companies.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="companies-dashboard">
      <div className="dashboard-header">
        <h1>Companies Management</h1>
        <p className="subtitle">View and manage all registered companies</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name, email or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Companies Grid */}
      <div className="companies-grid">
        {companies.map((company) => (
          <div key={company._id} className="company-card">
            <div className="card-header">
              <img
                src={company.image_User ? `http://localhost:7001/images/${company.image_User}` : '/default-avatar.png'}
                alt={company.username}
                className="company-avatar"
              />
              <div className="company-info">
                <h3>{company.username}</h3>
                <span className="category-badge">
                  {company.companyInfo?.category || 'N/A'}
                </span>
              </div>
            </div>

            <div className="card-body">
              <p className="company-email">{company.email}</p>
              <p className="company-location">
                📍 {company.companyInfo?.location || 'Location not specified'}
              </p>
              
              {company.companyInfo?.description && (
                <p className="company-description">
                  {company.companyInfo.description.substring(0, 100)}
                  {company.companyInfo.description.length > 100 ? '...' : ''}
                </p>
              )}

              <div className="company-stats">
                <div className="stat-item">
                  <span className="stat-value">{company.stats?.totalOffers || 0}</span>
                  <span className="stat-label">Total Offers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{company.stats?.activeOffers || 0}</span>
                  <span className="stat-label">Active Offers</span>
                </div>
              </div>

              <div className="company-meta">
                <span className={`status-badge ${company.isActive ? 'active' : 'inactive'}`}>
                  {company.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="join-date">
                  Joined: {new Date(company.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="card-footer">
              <button
                onClick={() => handleViewDetails(company._id)}
                className="view-details-btn"
              >
                View Details & Offers
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Previous page"
          >
            ←
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}

      {/* Modal for Company Details */}
      {showModal && selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => {
            setShowModal(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
};

// Modal Component for detailed view
const CompanyDetailsModal = ({ company, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <img
            src={company.company.image_User ? `http://localhost:7001/images/${company.company.image_User}` : '/default-avatar.png'}
            alt={company.company.username}
            className="modal-avatar"
          />
          <div>
            <h2>{company.company.username}</h2>
            <p>{company.company.email}</p>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Company Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            Offers ({company.offers.length})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'info' && (
            <div className="company-details">
              <div className="detail-group">
                <label>Category:</label>
                <span>{company.company.companyInfo?.category || 'N/A'}</span>
              </div>
              <div className="detail-group">
                <label>Location:</label>
                <span>{company.company.companyInfo?.location || 'N/A'}</span>
              </div>
              <div className="detail-group">
                <label>Founded:</label>
                <span>{company.company.companyInfo?.founded || 'N/A'}</span>
              </div>
              <div className="detail-group">
                <label>Size:</label>
                <span>{company.company.companyInfo?.size || 'N/A'}</span>
              </div>
              <div className="detail-group">
                <label>Website:</label>
                <a href={company.company.companyInfo?.website} target="_blank" rel="noopener noreferrer">
                  {company.company.companyInfo?.website || 'N/A'}
                </a>
              </div>
              <div className="detail-group full-width">
                <label>Description:</label>
                <p>{company.company.companyInfo?.description || 'No description'}</p>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="offers-list">
              {company.offers.length === 0 ? (
                <p className="no-data">No offers posted yet</p>
              ) : (
                company.offers.map((offer) => (
                  <div key={offer._id} className="offer-item">
                    <h3>{offer.jobTitle}</h3>
                    <div className="offer-meta">
                      <span className="offer-type">{offer.jobType}</span>
                      <span className="offer-salary">${offer.jobSalary}</span>
                      <span className={`quiz-badge ${offer.hasQuiz ? 'has-quiz' : ''}`}>
                        {offer.hasQuiz ? `${offer.quizzes.length} Quiz(zes)` : 'No Quiz'}
                      </span>
                    </div>
                    <div className="offer-stats">
                      <span>Applications: {offer.stats.totalApplications}</span>
                      <span>Pending: {offer.stats.pendingApplications}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsCompanyDash;