import React from "react";
import "./StatsCardsUserDash.css";

const StatsCardsUserDash = ({ stats }) => {
  return (
    <div className="st-grid">
      <div className="st-card tot">
        <div className="st-icn">👥</div>
        <div className="st-ctn">
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
          <span className="st-chg pos">+{stats.newUsersThisWeek || 0} this week</span>
        </div>
      </div>

      <div className="st-card cand">
        <div className="st-icn">🎯</div>
        <div className="st-ctn">
          <h3>{stats.totalCandidates || 0}</h3>
          <p>Candidates</p>
          <span className="st-chg pos">+{stats.newCandidatesLastWeek || 0} last 7 days</span>
        </div>
      </div>

      <div className="st-card comp">
        <div className="st-icn">🏢</div>
        <div className="st-ctn">
          <h3>{stats.totalCompanies || 0}</h3>
          <p>Companies</p>
          <span className="st-chg">All categories</span>
        </div>
      </div>

      <div className="st-card actv">
        <div className="st-icn">✅</div>
        <div className="st-ctn">
          <h3>{stats.activeUsers || 0}</h3>
          <p>Active Users</p>
          <span className="st-chg pos">
            {((stats.activeUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% of total
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCardsUserDash;
