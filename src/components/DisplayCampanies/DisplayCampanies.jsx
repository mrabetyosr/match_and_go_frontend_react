import React, { useEffect, useRef, useState } from 'react';
import './DisplayCampanies.css';

const DisplayCampanies = ({ category }) => {
  const [companies, setCompanies] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:7001/api/users/getAllCompany";
        
        if (category && category !== "All") {
          url = `http://localhost:7001/api/users/getCompaniesByCategory/${category}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
                
        setCompanies(data.companies || []);
      } catch (err) {
        console.error("Error loading companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [category]);

  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const timer = setTimeout(updateArrowVisibility, 100);
    return () => clearTimeout(timer);
  }, [companies]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);

    return () => {
      container.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', updateArrowVisibility);
    };
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading-display-company">
        <div className="spinner-display-company"></div>
        <p>Loading companies...</p>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="no-companies-display-company">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <p>No companies found for this category</p>
      </div>
    );
  }

  return (
    <div className="scroll-wrapper-display-company">
      {showLeftArrow && (
        <button 
          className="scroll-arrow-display-company left-display-company" 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}
      
      <div className="company-list-horizontal-display-company" ref={scrollContainerRef}>
        {companies.map(company => (
          <div key={company._id} className="company-card-display-company">
            <div className="company-cover-wrapper-display-company">
              <img 
                src={`http://localhost:7001/images/${company.cover_User}`}
                alt={`${company.username} cover`}
                className="company-cover-display-company"
                onError={(e) => e.target.src = 'http://localhost:7001/images/defaultCover.png'}
              />
            </div>
            
            <div className="company-content-display-company">
              <div className="company-logo-wrapper-display-company">
                <img 
                  src={`http://localhost:7001/images/${company.image_User}`}
                  alt={`${company.username} logo`}
                  className="company-logo-display-company"
                  onError={(e) => e.target.src = 'http://localhost:7001/images/user.png'}
                />
              </div>
              
              <h2 className="company-name-display-company">{company.username}</h2>
              
              {company.companyInfo?.category && (
                <span className="company-category-display-company">
                  {company.companyInfo.category}
                </span>
              )}

              {company.companyInfo?.description && (
                <p className="company-description-display-company">
                  {company.companyInfo.description.length > 100
                    ? `${company.companyInfo.description.substring(0, 100)}...`
                    : company.companyInfo.description}
                </p>
              )}

              <div className="company-details-display-company">
                {company.companyInfo?.location && (
                  <div className="detail-item-display-company">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{company.companyInfo.location}</span>
                  </div>
                )}
                
                {company.companyInfo?.size && (
                  <div className="detail-item-display-company">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{company.companyInfo.size} employees</span>
                  </div>
                )}

                {company.companyInfo?.founded && (
                  <div className="detail-item-display-company">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Founded {company.companyInfo.founded}</span>
                  </div>
                )}
              </div>

              {company.companyInfo?.website && (
                <a 
                  href={company.companyInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="company-website-display-company"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showRightArrow && (
        <button 
          className="scroll-arrow-display-company right-display-company" 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};

export default DisplayCampanies;