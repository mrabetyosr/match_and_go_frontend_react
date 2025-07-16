import React from 'react';
import { assets } from '../../assets/assets';
import './JobSection.css';

const JobSection = () => {
  return (
    <div className="job-section">
      <h1 className="job-image-title">Find a job</h1>
      
      <div className="job-section-image-container">
        <img src={assets.findjob} alt="Team working" className="job-image" />

        <div className="job-text-overlay">
          <h1>Find a Place Where You Belong</h1>
          <p>Explore authentic teams, values, and daily life. Go beyond job titles to find real fit.</p>
          <p>Every company has a story. Discover their culture before applying.</p>
          <p><strong>MATCH&GO</strong> helps you connect with companies that match your goals and values — faster, smarter, and more personally.</p>
          <button className="find-job-button">Find Job</button>
        </div>
      </div>
    </div>
    
  );
};

export default JobSection;