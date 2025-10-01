import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OffersApplicantsGeneralDash.css";

const OffersApplicantsGeneralDash = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:7001/api/dashboard/offers-with-applicants",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOffers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <p>⏳ Chargement...</p>;
  if (error) return <p className="err">{error}</p>;

  return (
    <div className="off-cont">
      <h2>📊 Offres et Candidats</h2>

      <table className="off-tbl">
        <thead>
          <tr>
            <th>Entreprise</th>
            <th>Offre</th>
            <th>Candidats</th>
            <th>Max Slots</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.offerId}>
              {/* Entreprise */}
              <td>
                {offer.company.logo ? (
                  <img
                    src={offer.company.logo}
                    alt="logo"
                    className="cmp-logo"
                  />
                ) : (
                  <div className="cmp-logo def-logo">
                    {offer.company.username.charAt(0).toUpperCase()}
                  </div>
                )}
                {offer.company.username}
              </td>

              {/* Job */}
              <td>{offer.jobTitle}</td>

              {/* Candidats */}
              <td>
                {offer.applicants.length > 0 ? (
                  <div className="cand-list">
                    {offer.applicants.map((c, i) =>
                      c.logo ? (
                        <img
                          key={i}
                          src={c.logo}
                          alt={c.username}
                          title={`${c.username} (${c.status})`}
                          className="cand-logo"
                        />
                      ) : (
                        <div key={i} className="cand-logo def-logo">
                          {c.username.charAt(0).toUpperCase()}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <span className="no-cand">Aucun candidat</span>
                )}
              </td>

              {/* Max Slots */}
              <td>
                <div className="prg-cont">
                  <div
                    className="prg-bar"
                    style={{
                      width: `${Math.min(
                        (offer.applicants.length / offer.maxCandidates) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="prg-txt">
                  {offer.applicants.length} / {offer.maxCandidates}
                </span>
              </td>

              {/* Deadline */}
              <td>{new Date(offer.applicationDeadline).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OffersApplicantsGeneralDash;
