import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ViewCandidatePosts.css";
import UpdatePosts from "../Updateposts/Updateposts";

const reactionEmojis = {
  like: "👍",
  celebrate: "🎉",
  support: "🤝",
  insightful: "💡",
  curious: "🤔",
};

const ViewCandidatePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  const token = localStorage.getItem("token");
  let userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:7001/api/users/${userId}/posts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token, userId]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(
        `http://localhost:7001/api/posts/post/delete/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateSuccess = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
    setEditingPostId(null);
  };

if (loading) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No posts found.</p>;

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          {editingPostId === post._id ? (
            <UpdatePosts
              post={post}
              token={token}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={() => setEditingPostId(null)}
            />
          ) : (
            <div>
              <p>{post.content}</p>
              {post.photo && (
                <img
                  src={`http://localhost:7001${post.photo}`}
                  alt="Post"
                  className="post-image"
                />
              )}

              {/* Reactions with emojis */}
              <div className="reactions">
                <strong>Reactions ({post.reactionsCount}):</strong>
                {post.reactions.map((reaction) => (
                  <span key={reaction._id} style={{ marginRight: "8px" }}>
                    {reactionEmojis[reaction.type]} {reaction.user.username}
                  </span>
                ))}
              </div>

              {/* Comments */}
              <div className="comments">
                <strong>Comments ({post.commentsCount}):</strong>
                {post.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <p>
                      <strong>{comment.author.username}:</strong> {comment.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shares */}
              <div className="shares">
                <strong>Shares ({post.sharesCount}):</strong>
                {post.shares.map((share) => (
                  <span key={share._id}>{share.user.username}</span>
                ))}
              </div>

              <div className="post-actions">
                <button onClick={() => setEditingPostId(post._id)}>Edit</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewCandidatePosts;
