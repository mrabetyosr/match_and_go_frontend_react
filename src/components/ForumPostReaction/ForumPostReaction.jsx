import React from "react";
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
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleReaction = async (type) => {
    try {
      await axios.post(
        `http://localhost:7001/api/users/posts/${postId}/reactions`,
        { type },
        { headers }
      );
      if (onReaction) onReaction();
    } catch (err) {
      console.error("Erreur lors de la réaction :", err);
    }
  };

  return (
    <div className="reaction-menu">
      {Object.entries(reactionsMap).map(([type, emoji]) => (
        <span
          key={type}
          className="reaction-emoji"
          onClick={() => handleReaction(type)}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default ForumPostReaction;
