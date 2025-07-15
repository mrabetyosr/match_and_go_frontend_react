import React from 'react';
import './DisplayCampanies.css'; // Assuming you have a CSS file for styling
import { companies } from '../../assets/assets'; // Adjust the path as necessary
const DisplayCampanies = ({ category }) => {
    const filteredCompanies = category === 'All'
    ? companies
    : companies.filter(company => company.category === category);
  return (
 <div className="company-list">
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default DisplayCampanies;
