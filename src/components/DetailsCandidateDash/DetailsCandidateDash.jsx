import React, { useEffect, useState } from "react";
import axios from "axios";
import { Award, Medal, Trophy, Crown, Gem, Mail, Briefcase } from "lucide-react";
import HandLoader from "../HandLoader/HandLoader";
import "./DetailsCandidateDash.css";

const DetailsCandidateDash = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:7001/api/profile/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error fetching candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const getBadgeIcon = (badge) => {
    const icons = {
      "Bronze Applicant": <Award className="badge-icn" />,
      "Silver Applicant": <Medal className="badge-icn" />,
      "Gold Applicant": <Trophy className="badge-icn" />,
      "Platinum Applicant": <Crown className="badge-icn" />,
      "Diamond Applicant": <Gem className="badge-icn" />,
    };
    return icons[badge] || <Award className="badge-icn" />;
  };

  if (loading) return <HandLoader size={80} />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!candidates.length) return <p>No candidates found</p>;

  return (
    <div className="cand-wrap">
      {candidates.map((user) => (
        <div key={user._id} className="cand-card">
          {/* Header */}
          <div className="cand-hdr">
            <img
              src={user.image_User ? `http://localhost:7001/images/${user.image_User}` : "/user.png"}
              alt={user.username}
              className="cand-avt"
            />
            <div className="cand-info">
              <h3>{user.username}</h3>
              <p className="cand-email"><Mail size={16} /> {user.email}</p>
              <span className="cand-role"><Briefcase size={14} /> {user.role}</span>
            </div>
          </div>

          {/* Top Badge */}
          {user.candidateInfo?.topBadge && (
            <div className="cand-top-badge">
              {getBadgeIcon(user.candidateInfo.topBadge)}
            </div>
          )}

          {/* All Badges */}
          {user.candidateInfo?.badges?.length > 0 && (
            <div className="cand-badges">
              {user.candidateInfo.badges.map((badge, i) => (
                <span key={i} className={`badge-icn`}>
                  {getBadgeIcon(badge)}
                </span>
              ))}
            </div>
          )}

          {/* Extra Info */}
          <div className="cand-det">
            {user.candidateInfo?.phoneNumber && <div><strong>Phone:</strong> {user.candidateInfo.phoneNumber}</div>}
            {user.candidateInfo?.location && <div><strong>Location:</strong> {user.candidateInfo.location}</div>}
          </div>

          {/* Skills */}
          {user.candidateInfo?.skills?.length > 0 && (
            <div className="cand-skl">
              <strong>Skills:</strong>
              <div className="skl-list">
                {user.candidateInfo.skills.map((skill, idx) => (
                  <span key={idx} className="skl-item">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DetailsCandidateDash;
