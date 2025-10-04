import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Importer useNavigate
import ForumPostReaction from "../ForumPostReaction/ForumPostReaction";
import ForumPostComment from "../ForumPostComment/ForumPostComment";
import HandLoader from "../HandLoader/HandLoader";
import "./ForumPost.css";

const reactionsMap = {
  like: "👍",
  celebrate: "🎉",
  support: "❤️",
  insightful: "💡",
  curious: "🤔",
};

const ForumPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReactionsPostId, setShowReactionsPostId] = useState(null);
  const [showCommentsPostId, setShowCommentsPostId] = useState(null);
  const [reactionsData, setReactionsData] = useState({});

  const navigate = useNavigate(); // ✅ Hook pour la navigation
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:7001/api/users/posts", { headers });
      setPosts(res.data);

      const reactionsDataFromPosts = {};
      res.data.forEach(post => {
        if (post.reactionsByType) {
          reactionsDataFromPosts[post._id] = post.reactionsByType;
        }
      });
      setReactionsData(reactionsDataFromPosts);
    } catch (err) {
      console.error("Erreur lors de la récupération des posts ou réactions :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleShare = async (postId) => {
    try {
      await axios.post(
        `http://localhost:7001/api/users/posts/${postId}/share`,
        {},
        { headers }
      );
      fetchPosts();
    } catch (err) {
      console.error("Erreur lors du partage :", err);
    }
  };

  // ✅ Fonction pour naviguer vers le profil
  const handleProfileClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  if (loading) {
    return (
      <div className="forum-loading">
        <HandLoader size={100} />
        <p className="forum-loading__text">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) return <p>Aucun post disponible.</p>;

  return (
    <div className="forum">
      {posts.map((post) => {
        const postReactions = reactionsData[post._id] || {};
        const reactedTypes = Object.entries(postReactions)
          .filter(([type, data]) => data.users && data.users.length > 0)
          .map(([type]) => type);

        const totalReactions = Object.values(postReactions).reduce(
          (sum, data) => sum + (data.users ? data.users.length : 0),
          0
        );

        const tooltipContent = reactedTypes
          .map((type) => {
            const users = postReactions[type].users.map((u) => u.username).join(", ");
            return `${reactionsMap[type]}: ${users}`;
          })
          .join("\n");

        return (
          <article key={post._id} className="post">
            {/* User Header - ✅ Rendre cliquable */}
            <div className="post__header">
              <img 
                src={`http://localhost:7001/images/${post.author?.image_User || post.author?.logo || "user.png"}`} 
                alt={post.author?.username || "User"}
                className="post__avatar"
                onClick={() => handleProfileClick(post.author?._id)} // ✅ Navigation au clic
                style={{ cursor: 'pointer' }} // ✅ Curseur pointer
              />
              <div className="post__user-info">
                <h3 
                  className="post__username"
                  onClick={() => handleProfileClick(post.author?._id)} // ✅ Navigation au clic
                  style={{ cursor: 'pointer' }} // ✅ Curseur pointer
                >
                  {post.author?.username || "Utilisateur"}
                </h3>
                <time className="post__timestamp">
                  {post.createdAt && formatDate(post.createdAt)}
                </time>
              </div>
              {post.author?.role && (
                <span className="post__badge post__badge--role">
                  {post.author.role}
                </span>
              )}
            </div>

            <p className="post__content">{post.content}</p>

            {post.photo && (
              <div className="post__media post__media--photo">
                <img src={`http://localhost:7001${post.photo}`} alt="post" />
              </div>
            )}
            {post.document && (
              <div className="post__media post__media--document">
                <a href={`http://localhost:7001${post.document}`} target="_blank" rel="noopener noreferrer">
                  Voir le document
                </a>
              </div>
            )}

            <div className="post__actions">
              <button className="post__action post__action--share" onClick={() => handleShare(post._id)}>
                🔁 {post.sharesCount || 0}
              </button>

              <button
                className="post__action post__action--reactions"
                title={tooltipContent || "Aucune réaction"}
                onClick={() =>
                  setShowReactionsPostId(showReactionsPostId === post._id ? null : post._id)
                }
              >
                {reactedTypes.map((type) => reactionsMap[type]).join(" ")} {totalReactions > 0 ? `(${totalReactions})` : ""}
              </button>

              <button
                className="post__action post__action--comments"
                onClick={() =>
                  setShowCommentsPostId(showCommentsPostId === post._id ? null : post._id)
                }
              >
                💬 Commentaires ({post.commentsCount || 0})
              </button>
            </div>

            {showReactionsPostId === post._id && (
              <div className="post__reactions-panel">
                <ForumPostReaction postId={post._id} onReaction={fetchPosts} />
                <div className="reactions">
                  {Object.entries(postReactions).map(([type, data]) => {
                    if (!data.users || data.users.length === 0) return null;
                    return (
                      <div key={type} className="reactions__group">
                        <strong className="reactions__type">{reactionsMap[type]}</strong>
                        <div className="reactions__users">
                          {data.users.map((user) => (
                            <div 
                              key={user._id} 
                              className="reaction-user"
                              onClick={() => handleProfileClick(user._id)} // ✅ Navigation au clic sur user
                              style={{ cursor: 'pointer' }} // ✅ Curseur pointer
                            >
                              <img
                                src={`http://localhost:7001/images/${user.logo || "user.png"}`}
                                alt={user.username}
                                className="reaction-user__avatar"
                              />
                              <span className="reaction-user__name">{user.username}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showCommentsPostId === post._id && (
              <ForumPostComment postId={post._id} onCommentAdded={fetchPosts} />
            )}
          </article>
        );
      })}
    </div>
  );
};

export default ForumPost;