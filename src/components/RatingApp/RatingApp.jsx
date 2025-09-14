import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RatingApp.css"; // ⚡️ nouveau nom pour le CSS

const RatingApp = ({ userInfo, setUserInfo }) => {
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userInfo && !userInfo.hasRatedApp) {
      setShowModal(true);
    }
  }, [userInfo]);

  const handleRating = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7001/api/rating/rate",
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInfo({ ...userInfo, hasRatedApp: true });
      setShowModal(false);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error while rating");
    }
  };

  if (!showModal) return null;

  return (
    <div className="app-rating-overlay">
      <div className="app-rating-box">
        {/* Bouton X */}
        <button className="app-rating-close" onClick={() => setShowModal(false)}>
          ✖
        </button>

        <h2 className="app-rating-title">Rate our App ⭐</h2>
        <div className="app-rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "app-star app-star-selected" : "app-star"}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button
          className="app-rating-submit"
          onClick={handleRating}
          disabled={rating === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RatingApp;
