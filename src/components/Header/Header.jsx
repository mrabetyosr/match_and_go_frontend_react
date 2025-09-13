import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- hook react-router

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 1) {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:7001/api/offers/search?q=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleFindJob = () => {
    navigate("/find-job"); // navigate vers la page de recherche globale
  };

  const handleSelectJob = (jobId) => {
    navigate(`/find-job/details/${jobId}`); // navigate vers la page de détails
  };

  return (
    <div className="hd-container">
      <video className="hd-video" autoPlay loop muted>
        <source src={assets.headervideo1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hd-overlay">
        <h2 className="hd-title">One Match Away from Your Next Move</h2>

        <div className="hd-search-sec">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search for jobs, companies..."
            className="hd-input"
          />
          <button className="hd-btn" onClick={handleFindJob}>
            Find a Job
          </button>

          {query && suggestions.length > 0 && (
            <ul className="hd-dropdown">
              {suggestions.map((offer) => {
                const company = offer.companyId;
                return (
                  <li
                    key={offer._id}
                    className="hd-dropdown-item"
                    onClick={() => handleSelectJob(offer._id)} // <-- click vers détails
                  >
                    {company?.image_User && (
                      <img
                        src={`http://localhost:7001/images/${company.image_User}`}
                        alt={company.username}
                        className="hd-logo"
                      />
                    )}
                    <div className="hd-info">
                      <strong className="hd-job-title">{offer.jobTitle}</strong>
                      {company && (
                        <p className="hd-company-details">
                          {company.username} 
                          {company.companyInfo &&
                            ` - ${company.companyInfo.category}, ${company.companyInfo.location}`}
                        </p>
                      )}
                      {offer?.description && (
                        <p className="hd-desc">{offer.description.slice(0, 80)}...</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="hd-subtitle">
          Companies are interested in your profile. Let them see you’re available.
        </p>
      </div>
    </div>
  );
};

export default Header;
