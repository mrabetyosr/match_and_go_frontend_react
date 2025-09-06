import React, { useState, useEffect } from "react";
import axios from "axios";
import ForumPostReply from "../ForumPostReply/ForumPostReply";
import "./ForumPostComment.css";

const ForumPostComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [activeReplies, setActiveReplies] = useState({}); // Track open replies

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:7001/api/users/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:7001/api/users/posts/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editingContent.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:7001/api/users/comments/${id}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditingContent("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:7001/api/users/comments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setActiveReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Écrire un commentaire..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Commenter"}
        </button>
      </form>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              {editingId === comment._id ? (
                <>
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(comment._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{comment.author.username}</strong>: {comment.content}
                  <div className="comment-actions">
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditingContent(comment.content);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(comment._id)}>Delete</button>
                    {/* Like / Reply toggle */}
                    <button onClick={() => toggleReplies(comment._id)}>
                      {activeReplies[comment._id] ? "Hide Replies" : "Reply"}
                    </button>
                  </div>

                  {/* Show replies only if toggled */}
                  {activeReplies[comment._id] && (
                    <ForumPostReply
                      commentId={comment._id}
                      onReplyAdded={fetchComments}
                    />
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPostComment;
