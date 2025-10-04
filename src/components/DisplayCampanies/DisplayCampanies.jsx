// DisplayCampanies.jsx
import React, { useEffect, useRef, useState } from 'react';
import './DisplayCampanies.css';

const DisplayCampanies = ({ category }) => {
  const [companies, setCompanies] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
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
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (!companies || companies.length === 0) {
    return (
      <div className="no-companies-display-company">
        <p>No companies found for this category.</p>
      </div>
    );
  }

  return (
    <div className="scroll-wrapper-display-company">
      {showLeftArrow && (
        <button className="scroll-arrow-display-company left-display-company" onClick={scrollLeft}>
          {'<'}
        </button>
      )}
      
      <div className="company-list-horizontal-display-company" ref={scrollContainerRef}>
        {companies.map(company => (
          <div key={company._id} className="company-card-display-company">
            <img 
              src={`http://localhost:7001/images/${company.cover_User}`}
              alt="cover"
              className="company-cover-display-company"
            />
            
            <div className="company-content-display-company">
              <img 
                src={`http://localhost:7001/images/${company.image_User}`}
                alt="logo"
                className="company-logo-display-company"
              />
              
              <h2>{company.username}</h2>
              
              {company.companyInfo?.description && (
                <p>{company.companyInfo.description}</p>
              )}
              {company.companyInfo?.location && (
                <p><strong>Location:</strong> {company.companyInfo.location}</p>
              )}
              {company.companyInfo?.founded && (
                <p><strong>Founded:</strong> {company.companyInfo.founded}</p>
              )}
              {company.companyInfo?.size && (
                <p><strong>Employees:</strong> {company.companyInfo.size}</p>
              )}
              {company.companyInfo?.website && (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={company.companyInfo.website} target="_blank" rel="noopener noreferrer">
                    {company.companyInfo.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showRightArrow && (
        <button className="scroll-arrow-display-company right-display-company" onClick={scrollRight}>
          {'>'}
        </button>
      )}
    </div>
  );
};

export default DisplayCampanies;