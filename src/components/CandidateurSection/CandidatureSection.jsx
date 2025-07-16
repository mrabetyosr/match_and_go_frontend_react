import React from 'react';
import './CandidatureSection.css'; // Assuming you have a CSS file for styling
import { assets } from '../../assets/assets'; // Adjust the path as necessary
const CandidatureSection = () => {
  return (

    <div className="condidature-section">
      <h2 className="condidature-section-title">Follow Your Application</h2>

      <div className="condidature-section-content">
        <div className="condidature-section-image">
          <div className="decorated-image">
            <img
              src={assets.candidaturesection}
              alt="Application tracking"
              className="main-image"
            />
          </div>
        </div>

        <div className="condidature-section-text">
          <h1>Track Your Job Journey in Real-Time</h1>
          <p>
            Never wonder where your application stands again. Stay updated on every stage of the hiring process
            — from submission to interview to final decision — all in one place.
          </p>
          <p>
            Our smart tracking system gives you peace of mind and control. Receive instant notifications,
            recruiter messages, and progress updates so you're always in the loop.
          </p>
          <button className="follow-condidature-button">Follow Application</button>
        </div>
      </div>
    </div>
  );
};
export default CandidatureSection;
