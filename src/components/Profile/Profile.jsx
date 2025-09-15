import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Profile.css"; // Ton style moderne

const Profile = () => {
  const { id } = useParams(); // ID depuis l'URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:7001/api/profile/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error fetching user");
      }
    };

    fetchUser();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      {/* Image de couverture */}
      <div className="profile-cover">
        <img
          src={user.cover_User ? `http://localhost:7001/images/${user.cover_User}` : "/defaultCover.png"}
          alt="Cover"
          className="cover-img"
        />
      </div>

      {/* Header */}
      <div className="profile-header">
        <img
          src={user.image_User ? `http://localhost:7001/images/${user.image_User}` : "/user.png"}
          alt="Profile"
          className="profile-img"
        />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      {/* Infos Entreprise */}
      {user.role === "company" && (
        <div className="info-card">
          <h3>🏢 Company Information</h3>
          <p><strong>Description:</strong> {user.companyInfo?.description}</p>
          <p><strong>Location:</strong> {user.companyInfo?.location}</p>
          <p><strong>Category:</strong> {user.companyInfo?.category}</p>
          <p><strong>Founded:</strong> {user.companyInfo?.founded}</p>
          <p><strong>Size:</strong> {user.companyInfo?.size}</p>
          <p>
            <strong>Website:</strong>{" "}
            <a href={user.companyInfo?.website} target="_blank" rel="noreferrer">
              {user.companyInfo?.website}
            </a>
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a href={user.companyInfo?.socialLinks?.linkedin} target="_blank" rel="noreferrer">
              {user.companyInfo?.socialLinks?.linkedin}
            </a>
          </p>

          {/* Carte OpenStreetMap */}
          {user.companyInfo?.coordinates?.lat && user.companyInfo?.coordinates?.lng && (
            <div className="map-container" style={{ height: "300px", marginTop: "20px" }}>
              <MapContainer
                center={[user.companyInfo.coordinates.lat, user.companyInfo.coordinates.lng]}
                zoom={13}
                style={{ width: "100%", height: "100%", borderRadius: "12px" }}
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

      {/* Infos Candidat */}
      {user.role === "candidate" && (
        <div className="info-card">
          <h3>👤 Candidate Information</h3>
          <p><strong>Phone:</strong> {user.candidateInfo?.phoneNumber}</p>
          <p><strong>Location:</strong> {user.candidateInfo?.location}</p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {user.candidateInfo?.dateOfBirth
              ? new Date(user.candidateInfo?.dateOfBirth).toLocaleDateString()
              : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
