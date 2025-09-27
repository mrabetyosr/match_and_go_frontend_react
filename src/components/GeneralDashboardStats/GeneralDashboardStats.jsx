import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GeneralDashboardStats.css";

const GeneralDashboardStats = () => {
  const [candidates, setCandidates] = useState(0);
  const [companies, setCompanies] = useState(0);
  const [offers, setOffers] = useState(0);
  const [posts, setPosts] = useState(0);
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

        setCandidates(candidateRes.data.candidates);
        setCompanies(companyRes.data.companies);
        setOffers(offerRes.data.offers);
        setPosts(postRes.data.posts);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <p className="loading-text">Chargement des statistiques...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="dash-cont">
      <div className="dash-card">
        <h3>Candidats</h3>
        <p>{candidates}</p>
      </div>
      <div className="dash-card">
        <h3>Entreprises</h3>
        <p>{companies}</p>
      </div>
      <div className="dash-card">
        <h3>Offres</h3>
        <p>{offers}</p>
      </div>
      <div className="dash-card">
        <h3>Posts</h3>
        <p>{posts}</p>
      </div>
    </div>
  );
};

export default GeneralDashboardStats;