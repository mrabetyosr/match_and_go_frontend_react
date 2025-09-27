import React from 'react';
import './RecentActivityUserDash.css';
const RecentActivityUserDash = ({ recentActivity, formatDate }) => {
  return (
    <div className="activity-section">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {recentActivity.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-avatar">
              <img src={`http://localhost:7001/images/${activity.userImage}`} alt="" />
            </div>
            <div className="activity-content">
              <p><strong>{activity.username}</strong> {activity.action}</p>
              <span className="activity-time">{formatDate(activity.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityUserDash;