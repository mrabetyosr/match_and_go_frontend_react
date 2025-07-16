import React from 'react';
import './ExploreCampanies.css'; // Assuming you have a CSS file for styling
const ExploreCampanies = ({ category, setCategory }) => {
    const categories = [
    "All",
    "Tech",
    "Advertising / Marketing",
    "Culture / Media",
    "Consulting / Audit",
    "Education / Training",
    "Finance / Banking"
  ];
  return (
    <div className="explore-companies">
      <h1>Explore companies</h1>
      <p>Uncover their journey, meet their team, experience their culture.</p>
      <div className="explore-companies-buttons">
        {categories.map((item, index) => (
          <button
            key={index}
            className={category === item ? 'active' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExploreCampanies;
