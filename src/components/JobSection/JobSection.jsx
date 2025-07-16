import React from 'react';
import './JobSection.css';
import { assets } from '../../assets/assets';

const JobSection = () => {
  return (
    <section className="job-section">
      <div className="job-section-content">
        <div className="job-section-heading-container">
          <h1 className="job-section-heading">Find a job</h1>
          <p className="job-section-subheading">
            You have the power to write your own story. The job is yours!
          </p>
        </div>
        <p className="job-section-paragraph">
          Tired of endless scrolling through irrelevant job posts? 
          With Match&Go, you don't just search you connect. Discover roles that truly fit you, 
          explore real company culture, and find your place in a team that matches your values and ambitions.
        </p>
        <button className="job-section-button">Find a job</button>
      </div>
      <div className="job-section-image-wrapper">
        <img
          src={assets.jobsection3}
          alt="People collaborating in an office"
          className="job-image-single"
        />
      </div>
    </section>
  );
};

export default JobSection;