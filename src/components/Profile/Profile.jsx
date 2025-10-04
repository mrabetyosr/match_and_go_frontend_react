import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Award, Medal, Trophy, Crown, Gem, Mail, Briefcase } from "lucide-react";
import "leaflet/dist/leaflet.css";
import HandLoader from "../HandLoader/HandLoader";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:7001/api/profile/${id}`);
        const userData = res.data;

        // Calculer topBadge si utilisateur est candidat
        if (userData.role === "candidate" && userData.candidateInfo?.badges) {
          const badges = userData.candidateInfo.badges;
          const badgeOrder = [
            "Bronze Applicant",
            "Silver Applicant",
            "Gold Applicant",
            "Platinum Applicant",
            "Diamond Applicant"
          ];

          let topBadge = null;
          for (let i = badgeOrder.length - 1; i >= 0; i--) {
            if (badges.includes(badgeOrder[i])) {
              topBadge = badgeOrder[i];
              break;
            }
          }
          userData.candidateInfo.topBadge = topBadge;
        }

        setUser(userData);
      } catch (err) {
        console.error("❌ Error fetching user:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getBadgeClass = (badge) => {
    const classes = {
      "Bronze Applicant": "badge-bronze",
      "Silver Applicant": "badge-silver",
      "Gold Applicant": "badge-gold",
      "Platinum Applicant": "badge-platinum",
      "Diamond Applicant": "badge-diamond"
    };
    return classes[badge] || "";
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      "Bronze Applicant": <Award size={20} />,
      "Silver Applicant": <Medal size={20} />,
      "Gold Applicant": <Trophy size={20} />,
      "Platinum Applicant": <Crown size={20} />,
      "Diamond Applicant": <Gem size={20} />
    };
    return icons[badge] || <Award size={20} />;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        <HandLoader size={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#fff',
        fontSize: '1.2em',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        ❌ {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#fff',
        fontSize: '1.2em',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        No user found
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-main">

        {/* Banner */}
        <div className="profile-banner">
          <img
            src={user.cover_User ? `http://localhost:7001/images/${user.cover_User}` : "/defaultCover.png"}
            alt="Cover"
            className="banner-image"
          />
          <div className="banner-overlay"></div>
        </div>

        {/* Header Section */}
        <div className="profile-info-section">
          <div className="profile-header-card">
            <img
              src={user.image_User ? `http://localhost:7001/images/${user.image_User}` : "/user.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-header-info">
              <h1 className="profile-username">{user.username}</h1>
              <p className="profile-email">
                <Mail size={18} />
                {user.email}
              </p>
              <span className="profile-role-badge">
                <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} />
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">

          {/* Company Info */}
          {user.role === "company" && (
            <div className="detail-card">
              <h2 className="card-title">🏢 Company Information</h2>

              {user.companyInfo?.description && <div className="detail-row"><span className="detail-label">Description</span><span className="detail-value">{user.companyInfo.description}</span></div>}
              {user.companyInfo?.location && <div className="detail-row"><span className="detail-label">Location</span><span className="detail-value">{user.companyInfo.location}</span></div>}
              {user.companyInfo?.category && <div className="detail-row"><span className="detail-label">Category</span><span className="detail-value">{user.companyInfo.category}</span></div>}
              {user.companyInfo?.founded && <div className="detail-row"><span className="detail-label">Founded</span><span className="detail-value">{user.companyInfo.founded}</span></div>}
              {user.companyInfo?.size && <div className="detail-row"><span className="detail-label">Company Size</span><span className="detail-value">{user.companyInfo.size}</span></div>}
              {user.companyInfo?.website && <div className="detail-row"><span className="detail-label">Website</span><a href={user.companyInfo.website} target="_blank" rel="noreferrer" className="detail-link">{user.companyInfo.website}</a></div>}
              {user.companyInfo?.socialLinks?.linkedin && <div className="detail-row"><span className="detail-label">LinkedIn</span><a href={user.companyInfo.socialLinks.linkedin} target="_blank" rel="noreferrer" className="detail-link">{user.companyInfo.socialLinks.linkedin}</a></div>}

              {/* Map */}
              {user.companyInfo?.coordinates?.lat && user.companyInfo?.coordinates?.lng && (
                <div className="map-wrapper" style={{ height: "300px", width: "100%", marginTop: "20px" }}>
                  <MapContainer
                    center={[user.companyInfo.coordinates.lat, user.companyInfo.coordinates.lng]}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    <Marker position={[user.companyInfo.coordinates.lat, user.companyInfo.coordinates.lng]}>
                      <Popup>{user.username}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          )}

          {/* Candidate Info */}
          {user.role === "candidate" && (
            <div className="detail-card">
              <h2 className="card-title">👤 Candidate Information</h2>

              {user.candidateInfo?.phoneNumber && <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{user.candidateInfo.phoneNumber}</span></div>}
              {user.candidateInfo?.location && <div className="detail-row"><span className="detail-label">Location</span><span className="detail-value">{user.candidateInfo.location}</span></div>}
              {user.candidateInfo?.dateOfBirth && <div className="detail-row"><span className="detail-label">Date of Birth</span><span className="detail-value">{new Date(user.candidateInfo.dateOfBirth).toLocaleDateString()}</span></div>}
              {user.candidateInfo?.bio && <div className="detail-row"><span className="detail-label">Bio</span><span className="detail-value">{user.candidateInfo.bio}</span></div>}
              {user.candidateInfo?.skills?.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Skills</span>
                  <div className="skills-tags">{user.candidateInfo.skills.map((skill, i) => <span key={i} className="skill-tag">{skill}</span>)}</div>
                </div>
              )}
              {user.candidateInfo?.experience && <div className="detail-row"><span className="detail-label">Experience</span><span className="detail-value">{user.candidateInfo.experience}</span></div>}
              {user.candidateInfo?.education && <div className="detail-row"><span className="detail-label">Education</span><span className="detail-value">{user.candidateInfo.education}</span></div>}
              {user.candidateInfo?.resume && <div className="detail-row"><span className="detail-label">Resume</span><a href={`http://localhost:7001/uploads/${user.candidateInfo.resume}`} target="_blank" rel="noreferrer" className="detail-link">📄 View Resume</a></div>}

              {/* Badges */}
              {(user.candidateInfo?.topBadge || (user.candidateInfo?.badges?.length > 0)) && (
                <div className="badges-showcase">
                  {user.candidateInfo?.topBadge && (
                    <div className="top-badge-display">
                      <h3 className="badge-section-title">🏆 Top Achievement</h3>
                      <span className={`achievement-badge ${getBadgeClass(user.candidateInfo.topBadge)}`}>
                        {getBadgeIcon(user.candidateInfo.topBadge)}
                        <span>{user.candidateInfo.topBadge}</span>
                      </span>
                    </div>
                  )}
                  {user.candidateInfo?.badges?.length > 0 && (
                    <div className="all-badges-display">
                      <h3 className="badge-section-title">🎖️ All Achievements</h3>
                      <div className="badges-collection">
                        {user.candidateInfo.badges.map((badge, index) => (
                          <span key={index} className={`mini-badge ${getBadgeClass(badge)}`}>
                            {getBadgeIcon(badge)}
                            <span>{badge}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
