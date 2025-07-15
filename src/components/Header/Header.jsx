import React from 'react';
import './Header.css'; // Assuming you have a CSS file for styling
import { assets } from '../../assets/assets';
const Header = () => {
  return (
    <div className="header">
      <video className="header-video" autoPlay loop muted>
        <source src={assets.headervideo1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay Content */}
      <div className="header-overlay">
        <h2>One Match Away from Your Next Move</h2>
        <div className="search-section">
          <input type="text" placeholder="Search for jobs, companies..." />
          <button>Find a Job</button>
        </div>
        <p className="subheading">Companies are interested in your profile. Let them see you’re available.</p>
      </div>

    </div>
  );
}

export default Header;
