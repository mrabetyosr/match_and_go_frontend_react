import React from 'react';
import './RecentActivityUserDash.css';

const RecentActivityUserDash = ({ recentActivity, formatDate }) => {
  return (
    <div className="activity-section-userdash">
      <h3>Recent Activity</h3>
      <div className="activity-list-userdash">
        {recentActivity.map((activity, index) => (
          <div key={index} className="activity-item-userdash">
            <div className="activity-avatar-userdash">
              <img src={`http://localhost:7001/images/${activity.userImage}`} alt="" />
            </div>
            <div className="activity-content-userdash">
              <p><strong>{activity.username}</strong> {activity.action}</p>
              <span className="activity-time-userdash">{formatDate(activity.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityUserDash;