import React, { useState } from 'react';
import './GetFound.css';
import { assets } from '../../assets/assets'; // Make sure assets.GetFound points to the correct image path

const GetFound = () => {
  const [status, setStatus] = useState("not-available");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div
      className="get-found-container"
      style={{
        backgroundImage: `url(${assets.GetFound})`,
        backgroundSize: '70%',
        backgroundPosition: '80% center',
        backgroundRepeat: 'no-repeat',
        minHeight: '50vh', // optional: ensures the image covers the full view height
      }}
    >
      <div className="content-wrapper">
        <div className="main-content">
          <h1 className="main-title">Get Found!</h1>

          <div className="description">
            <p className="subtitle">Don't just be the one who searches—</p>
            <p>Be the one who gets found.</p>
            <p>Let recruiters see you're available, complete your profile, and let them come to you.</p>
          </div>

          <div className="status-card">
            <h3 className="status-title">My Status</h3>

            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="open-to-offers"
                  name="status"
                  value="open-to-offers"
                  checked={status === "open-to-offers"}
                  onChange={handleStatusChange}
                />
                <label htmlFor="open-to-offers">
                  <span className="status-label open-to-offers">Open to offers</span>
                  <span className="status-description">
                    I'm interested in hearing about new opportunities
                  </span>
                </label>
              </div>

              <div className="radio-option">
                <input
                  type="radio"
                  id="not-available"
                  name="status"
                  value="not-available"
                  checked={status === "not-available"}
                  onChange={handleStatusChange}
                />
                <label htmlFor="not-available">
                  <span className="status-label not-available">Not available</span>
                  <span className="status-description">
                    I don't want to be contacted by recruiters
                  </span>
                </label>
              </div>
            </div>

            {status === "not-available" && (
              <div className="feedback-message not-available-message">
                <p>
                  You've chosen not to be contacted by recruiters. You can change this setting anytime.
                </p>
              </div>
            )}

            {status === "available" && (
              <div className="feedback-message available-message">
                <p>
                  Great! Recruiters will be able to see that you're available for new opportunities.
                </p>
              </div>
            )}

            {status === "open-to-offers" && (
              <div className="feedback-message open-to-offers-message">
                <p>
                  You're open to hearing about new opportunities. Recruiters may reach out with relevant positions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetFound;
