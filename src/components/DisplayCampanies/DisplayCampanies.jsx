import React, { useEffect, useRef, useState } from 'react';
import './DisplayCampanies.css';

const DisplayCampanies = ({ category }) => {
  const [companies, setCompanies] = useState([]);
  const scrollContainerRef = useRef(null);

  // Charger les entreprises depuis ton backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let url = "http://localhost:7001/api/users/getAllCompany"; 
        if (category && category !== "All") {
          url = `http://localhost:7001/api/users/getCompaniesByCategory/${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        // ton backend retourne { companies: [...] }
        setCompanies(data.companies || []);
      } catch (err) {
        console.error("Erreur lors du chargement des entreprises :", err);
      }
    };

    fetchCompanies();
  }, [category]);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="scroll-wrapper">
      <button className="scroll-arrow left" onClick={scrollLeft}>{'<'}</button>
      <div className="company-list-horizontal" ref={scrollContainerRef}>
        {companies.map(company => (
          <div key={company._id} className="company-card">
            {/* Cover image */}
            <img 
              src={`http://localhost:7001/images/${company.cover_User}`} 
              alt="cover" 
              className="company-cover" 
            />

            <div className="company-content">
              {/* Logo */}
              <img 
                src={`http://localhost:7001/images/${company.image_User}`} 
                alt="logo" 
                className="company-logo" 
              />
              
              <h2>{company.username}</h2>
              <p>{company.companyInfo?.description}</p>
              <p><strong>Location:</strong> {company.companyInfo?.location}</p>
              <p><strong>Founded:</strong> {company.companyInfo?.founded}</p>
              <p><strong>Employees:</strong> {company.companyInfo?.size}</p>
              <p>
                <strong>Website:</strong>{' '}
                <a href={company.companyInfo?.website} target="_blank" rel="noopener noreferrer">
                  {company.companyInfo?.website}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="scroll-arrow right" onClick={scrollRight}>{'>'}</button>
    </div>
  );
};

export default DisplayCampanies;
