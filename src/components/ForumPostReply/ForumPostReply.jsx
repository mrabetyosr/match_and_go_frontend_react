import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForumPostReply.css";

const ForumPostReply = ({ commentId, onReplyAdded }) => {
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all replies for this comment
  const fetchReplies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:7001/api/users/comments/${commentId}/replies`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplies(Array.isArray(res.data.replies) ? res.data.replies : []);
    } catch (err) {
      console.error("Error fetching replies:", err);
      setReplies([]);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  // Add a reply
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:7001/api/users/comments/${commentId}/replies`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchReplies();
      if (onReplyAdded) onReplyAdded();
    } catch (err) {
      console.error("Error posting reply:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a reply
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:7001/api/users/replies/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReplies();
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  // Format date helper
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2,"0")}/${(date.getMonth()+1)
      .toString().padStart(2,"0")}/${date.getFullYear()} ${date.getHours()
      .toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div className="reply-section" style={{ marginLeft: "20px", marginTop: "10px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Répondre..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Reply"}
        </button>
      </form>

      <div className="replies-list">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply._id} className="reply-item">
              <div className="reply-content">
                <strong>{reply.author.username}</strong>: {reply.content}
                <span className="reply-time">{formatDate(reply.createdAt)}</span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(reply._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No replies yet.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPostReply;
