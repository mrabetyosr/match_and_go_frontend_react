import React from 'react';
import './StatsCardsUserDash.css';
const StatsCardsUserDash = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card total-users">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
          <span className="stat-change positive">+{stats.newUsersThisWeek || 0} this week</span>
        </div>
      </div>

      <div className="stat-card candidates">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <h3>{stats.totalCandidates || 0}</h3>
          <p>Candidates</p>
          <span className="stat-change positive">+{stats.newCandidatesLastWeek || 0} last 7 days</span>
        </div>
      </div>

      <div className="stat-card companies">
        <div className="stat-icon">🏢</div>
        <div className="stat-content">
          <h3>{stats.totalCompanies || 0}</h3>
          <p>Companies</p>
          <span className="stat-change">All categories</span>
        </div>
      </div>

      <div className="stat-card active-users">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <h3>{stats.activeUsers || 0}</h3>
          <p>Active Users</p>
          <span className="stat-change positive">
            {((stats.activeUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% of total
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCardsUserDash;