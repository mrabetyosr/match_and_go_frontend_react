import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumPostReaction from "../ForumPostReaction/ForumPostReaction";
import ForumPostComment from "../ForumPostComment/ForumPostComment";
import "./ForumPost.css";

const ForumPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReactions, setActiveReactions] = useState(null);
  const [activeComments, setActiveComments] = useState(null);

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
      // Refresh posts to update shares count
      fetchPosts();
    } catch (err) {
      console.error("Erreur lors du partage :", err);
    }
  };

  if (loading) return <p>Chargement des posts...</p>;
  if (posts.length === 0) return <p>Aucun post disponible.</p>;

  return (
    <div className="forum-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          {/* Auteur */}
          <div className="post-author">
            {post.author?.logo && (
              <img
                src={`http://localhost:7001/images/${post.author.logo}`}
                alt="logo"
                className="author-logo"
              />
            )}
            <strong>{post.author?.username || "Unknown Author"}</strong>
            <small>({post.author?.role || "N/A"})</small>
          </div>

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
                className="document-link"
              >
                <img
                  src="/images/pdf-thumbnail.png"
                  alt="PDF"
                  className="pdf-thumbnail"
                />
                <span>Voir le document</span>
              </a>
            </div>
          )}

          {/* Boutons de réaction, commentaire et partage */}
          <div className="post-actions">
            <button
              className="btn-reaction"
              onClick={() =>
                setActiveReactions(
                  activeReactions === post._id ? null : post._id
                )
              }
            >
              👍 {post.reactionsCount || 0}
            </button>
            <button
              className="btn-comment"
              onClick={() =>
                setActiveComments(
                  activeComments === post._id ? null : post._id
                )
              }
            >
              💬 {post.commentsCount || 0}
            </button>
            <button
              className="btn-share"
              onClick={() => handleShare(post._id)}
            >
              🔁 {post.sharesCount || 0}
            </button>
          </div>

          {/* Afficher les réactions seulement si activeReactions === post._id */}
          {activeReactions === post._id && (
            <ForumPostReaction postId={post._id} onReaction={fetchPosts} />
          )}

          {/* Afficher les commentaires seulement si activeComments === post._id */}
          {activeComments === post._id && (
            <ForumPostComment postId={post._id} onCommentAdded={fetchPosts} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ForumPost;
