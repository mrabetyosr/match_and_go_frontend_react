import React, { useRef } from 'react';
import './DisplayCampanies.css';
import { companies, jobs } from '../../assets/assets'; // Make sure jobs is also imported

const DisplayCampanies = ({ category }) => {
  const filteredCompanies =
    category === 'All'
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
                <p><strong>Founded:</strong> {company.founded}</p>
                <p><strong>Employees:</strong> {company.size}</p>
                <p><strong>Website:</strong>{' '}
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    {company.website}
                  </a>
                </p>
                <p><strong>Open Jobs:</strong> {
                  jobs.filter(job => job.companyId === company.id).length
                }</p>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={scrollRight}>{'>'}</button>
      </div>
    </>
  );
};

export default DisplayCampanies;
