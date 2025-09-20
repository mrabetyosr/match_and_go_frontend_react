import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ForumPostReaction.css";

const reactionsMap = {
  like: "👍",
  celebrate: "🎉",
  support: "❤️",
  insightful: "💡",
  curious: "🤔",
};

const ForumPostReaction = ({ postId, onReaction }) => {
  const [reactions, setReactions] = useState({});
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Récupérer les réactions existantes du post
  const fetchReactions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7001/api/users/posts/${postId}/reactions`,
        { headers }
      );
      setReactions(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des réactions :", err);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const handleReaction = async (type) => {
    try {
      await axios.post(
        `http://localhost:7001/api/users/posts/${postId}/reactions`,
        { type },
        { headers }
      );
      fetchReactions();
      if (onReaction) onReaction();
    } catch (err) {
      console.error("Erreur lors de la réaction :", err);
    }
  };

  return (
    <div className="reaction-menu">
      {Object.entries(reactionsMap).map(([type, emoji]) => {
        const reactionData = reactions[type];
        return (
         <div key={type} className={`reaction-emoji ${type}`} onClick={() => handleReaction(type)}>
  {emoji}
  {/* <span className="count">{reactionData?.count || 0}</span> */}
  
  {/* Liste des utilisateurs qui ont réagi */}
  {reactionData?.users && reactionData.users.length > 0 && (
    <div className="user-list">
      {reactionData.users.map((u, index) => (
        <img
          key={index}
          src={`http://localhost:7001/images/${u.logo || "user.png"}`}
          alt={u.username}
          title={u.username}
          className="reaction-user-avatar"
        />
      ))}
    </div>
  )}
</div>

        );
      })}
    </div>

  );
};

export default ForumPostReaction;
