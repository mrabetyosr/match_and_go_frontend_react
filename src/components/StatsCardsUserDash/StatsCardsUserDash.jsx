import React from 'react';
import './StatsCardsUserDash.css';

const StatsCardsUserDash = ({ stats }) => {
  return (
    <div className="stats-grid-userdash">
      <div className="stat-card-userdash total-users-userdash">
        <div className="stat-icon-userdash">👥</div>
        <div className="stat-content-userdash">
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
          <span className="stat-change-userdash positive-userdash">+{stats.newUsersThisWeek || 0} this week</span>
        </div>
      </div>

      <div className="stat-card-userdash candidates-userdash">
        <div className="stat-icon-userdash">🎯</div>
        <div className="stat-content-userdash">
          <h3>{stats.totalCandidates || 0}</h3>
          <p>Candidates</p>
          <span className="stat-change-userdash positive-userdash">+{stats.newCandidatesLastWeek || 0} last 7 days</span>
        </div>
      </div>

      <div className="stat-card-userdash companies-userdash">
        <div className="stat-icon-userdash">🏢</div>
        <div className="stat-content-userdash">
          <h3>{stats.totalCompanies || 0}</h3>
          <p>Companies</p>
          <span className="stat-change-userdash">All categories</span>
        </div>
      </div>

      <div className="stat-card-userdash active-users-userdash">
        <div className="stat-icon-userdash">✅</div>
        <div className="stat-content-userdash">
          <h3>{stats.activeUsers || 0}</h3>
          <p>Active Users</p>
          <span className="stat-change-userdash positive-userdash">
            {((stats.activeUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% of total
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCardsUserDash;
