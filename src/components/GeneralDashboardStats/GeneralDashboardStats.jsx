import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GeneralDashboardStats.css";

const GeneralDashboardStats = () => {
  const [stats, setStats] = useState({
    candidates: 0,
    companies: 0,
    offers: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [candidateRes, companyRes, offerRes, postRes] = await Promise.all([
          axios.get("http://localhost:7001/api/dashboard/admin/candidates-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:7001/api/dashboard/admin/companies-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:7001/api/dashboard/admin/offers-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:7001/api/dashboard/admin/posts-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          candidates: candidateRes.data.candidates,
          companies: companyRes.data.companies,
          offers: offerRes.data.offers,
          posts: postRes.data.posts,
        });
      } catch (err) {
        console.error(err);
        setError("Error while loading statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <p className="loading-text">Loading statistics...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="st-grid">
      <div className="st-card cand">
        <div className="st-icn">🎯</div>
        <div className="st-ctn">
          <h3>
            {stats.candidates || 0} <span>Candidates</span>
          </h3>
          <span className="st-chg pos">Registered total</span>
        </div>
      </div>

      <div className="st-card comp">
        <div className="st-icn">🏢</div>
        <div className="st-ctn">
          <h3>
            {stats.companies || 0} <span>Companies</span>
          </h3>
          <span className="st-chg">All categories</span>
        </div>
      </div>

      <div className="st-card off">
        <div className="st-icn">💼</div>
        <div className="st-ctn">
          <h3>
            {stats.offers || 0} <span>Offers</span>
          </h3>
          <span className="st-chg pos">Active & published</span>
        </div>
      </div>

      <div className="st-card pst">
        <div className="st-icn">📝</div>
        <div className="st-ctn">
          <h3>
            {stats.posts || 0} <span>Posts</span>
          </h3>
          <span className="st-chg">Latest additions</span>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboardStats;
