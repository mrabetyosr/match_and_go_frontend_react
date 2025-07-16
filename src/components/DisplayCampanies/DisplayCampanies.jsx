import React from 'react';
import './DisplayCampanies.css'; // Assuming you have a CSS file for styling
import { companies } from '../../assets/assets'; // Adjust the path as necessary
import { useRef } from 'react';
const DisplayCampanies = ({ category }) => {
    const filteredCompanies = category === 'All'
    ? companies
    : companies.filter(company => company.category === category);
      const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };
  return (
    <>
  <div className="scroll-wrapper">
      <button className="scroll-arrow left" onClick={scrollLeft}>{'<'}</button>
      <div className="company-list-horizontal" ref={scrollContainerRef}>
        {filteredCompanies.map(company => (
          <div key={company.id} className="company-card">
            <img src={company.cover} alt="cover" className="company-cover" />
            <div className="company-content">
              <img src={company.logo} alt="logo" className="company-logo" />
              <h2>{company.name}</h2>
              <p>{company.description}</p>
              <p><strong>Location:</strong> {company.location}</p>
              <p><strong>Job:</strong> {company.jobTitle}</p>
              <p><strong>Places:</strong> {company.jobSlots}</p>
              <button className="view-offer-button" onClick={() => alert(`Viewing offer for ${company.name}`)}>Details</button>
            </div>
          </div>
        ))}
      </div>
      <button className="scroll-arrow right" onClick={scrollRight}>{'>'}</button>
    </div>
    <div className="company-names-ticker">
        <div className="ticker-track">
          {/* Duplicate names for smooth infinite scroll */}
          {[...filteredCompanies, ...filteredCompanies].map((company, idx) => (
            <span key={idx} className="ticker-item">{company.name}</span>
          ))}
        </div>
      </div>
      </>
  );
}

export default DisplayCampanies;
