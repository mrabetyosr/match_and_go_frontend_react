import React from 'react';
import { 
  Users, TrendingUp, BarChart3 
} from 'lucide-react';
import './ApplicationStats.css';

const ApplicationStats = ({ applications }) => {
  // Statistics calculations
  const stats = {
    total: applications.length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    interviewed: applications.filter(app => app.status === 'interview_scheduled').length,
  };

  const acceptanceRate = stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0;
  const responseRate = stats.total > 0 ? (((stats.accepted + stats.rejected + stats.interviewed) / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="stats-section">
      <div className="stats-header">
        <h2>
          <BarChart3 className="section-icon" />
          Quick Overview
        </h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon-wrapper">
            <Users className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
            <div className="stat-change positive">+12% this week</div>
          </div>
        </div>

        <div className="stat-card metrics">
          <div className="stat-icon-wrapper">
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{acceptanceRate}%</div>
            <div className="stat-label">Acceptance Rate</div>
            <div className="stat-change positive">Above average</div>
          </div>
        </div>

        <div className="stat-card metrics">
          <div className="stat-icon-wrapper">
            <BarChart3 className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{responseRate}%</div>
            <div className="stat-label">Response Rate</div>
            <div className="stat-change positive">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStats;