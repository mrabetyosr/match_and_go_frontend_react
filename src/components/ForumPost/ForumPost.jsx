import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumPostReaction from "../ForumPostReaction/ForumPostReaction";
import HandLoader from "../HandLoader/HandLoader"; // Import du HandLoader
import "./ForumPost.css";

const ForumPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:7001/api/users/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des posts :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleShare = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:7001/api/users/posts/${postId}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts(); // rafraîchir le compteur de partage
    } catch (err) {
      console.error("Erreur lors du partage :", err);
    }
  };

  // Utilisation du HandLoader pendant le chargement
  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        flexDirection: 'column'
      }}>
        <HandLoader size={100} />
        <p style={{ marginTop: '20px', color: '#666' }}>Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) return <p>Aucun post disponible.</p>;

  return (
    <div className="forum-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          {/* Contenu */}
          <p className="post-content">{post.content}</p>

          {/* Photo */}
          {post.photo && (
            <div className="post-photo">
              <img src={`http://localhost:7001${post.photo}`} alt="post" />
            </div>
          )}

          {/* Document */}
          {post.document && (
            <div className="post-document">
              <a
                href={`http://localhost:7001${post.document}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir le document
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="post-actions">
            <button
              className="btn-share"
              onClick={() => handleShare(post._id)}
            >
              🔁 {post.sharesCount || 0}
            </button>
          </div>

          {/* Composant ForumPostReaction affiché, mais on ne clique pas dessus */}
          <ForumPostReaction postId={post._id} onReaction={() => {}} />
        </div>
      ))}
    </div>
  );
};

export default ForumPost;