import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForumPostReaction from "../ForumPostReaction/ForumPostReaction";
import ForumPostComment from "../ForumPostComment/ForumPostComment";
import HandLoader from "../HandLoader/HandLoader";
import "./ForumPost.css";

const REACTION_ICONS = {
  like: "👍",
  celebrate: "🎉",
  support: "❤️",
  insightful: "💡",
  curious: "🤔",
};

const ForumPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReactionsPostId, setActiveReactionsPostId] = useState(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [reactionsData, setReactionsData] = useState({});

  const navigate = useNavigate();
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

  // Composant pour l'en-tête du post
  const PostHeader = ({ author, createdAt }) => (
    <div className="forum-post-header">
      <img 
        src={`http://localhost:7001/images/${author?.image_User || author?.logo || "user.png"}`} 
        alt={author?.username || "User"}
        className="forum-post-header__avatar"
        onClick={() => handleProfileClick(author?._id)}
        style={{ cursor: 'pointer' }}
      />
      <div className="forum-post-header__info">
        <h3 
          className="forum-post-header__username"
          onClick={() => handleProfileClick(author?._id)}
          style={{ cursor: 'pointer' }}
        >
          {author?.username || "Utilisateur"}
        </h3>
        <time className="forum-post-header__timestamp">
          {createdAt && formatDate(createdAt)}
        </time>
      </div>
      {author?.role && (
        <span className="forum-post-header__badge">
          {author.role}
        </span>
      )}
    </div>
  );

  // Composant pour les médias du post
  const PostMedia = ({ photo, document }) => (
    <>
      {photo && (
        <div className="forum-post-media forum-post-media--photo">
          <img src={`http://localhost:7001${photo}`} alt="post" />
        </div>
      )}
      {document && (
        <div className="forum-post-media forum-post-media--document">
          <a href={`http://localhost:7001${document}`} target="_blank" rel="noopener noreferrer">
            Voir le document
          </a>
        </div>
      )}
    </>
  );

  // Composant pour les actions du post
  const PostActions = ({ post, postReactions, toggleReactions, toggleComments }) => {
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
        return `${REACTION_ICONS[type]}: ${users}`;
      })
      .join("\n");

    const displayReactions = totalReactions > 0 
      ? reactedTypes.map((type) => REACTION_ICONS[type]).join(" ") 
      : "👍";

    return (
      <div className="forum-post-actions">
        <button 
          className="forum-post-actions__btn forum-post-actions__btn--share" 
          onClick={() => handleShare(post._id)}
        >
          🔁 {post.sharesCount || 0}
        </button>

        <button
          className="forum-post-actions__btn forum-post-actions__btn--reactions"
          title={tooltipContent || "Aucune réaction"}
          onClick={toggleReactions}
        >
          {displayReactions}
          {totalReactions > 0 ? ` (${totalReactions})` : ""}
        </button>

        <button
          className="forum-post-actions__btn forum-post-actions__btn--comments"
          onClick={toggleComments}
        >
          💬 Commentaires ({post.commentsCount || 0})
        </button>
      </div>
    );
  };

  // Composant pour le panneau de réactions
  const ReactionsPanel = ({ postId, postReactions }) => (
    <div className="forum-reactions-panel">
      <ForumPostReaction postId={postId} onReaction={fetchPosts} />
      <div className="forum-reactions-list">
        {Object.entries(postReactions).map(([type, data]) => {
          if (!data.users || data.users.length === 0) return null;
         
        })}
      </div>
    </div>
  );

  // États de chargement et vide
  if (loading) {
    return (
      <div className="forum-container forum-container--loading">
        <HandLoader size={100} />
        <p className="forum-container__loading-text">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="forum-container__empty-message">Aucun post disponible.</p>;
  }

  return (
    <div className="forum-container">
      {posts.map((post) => {
        const postReactions = reactionsData[post._id] || {};

        return (
          <article key={post._id} className="forum-post-card">
            <PostHeader 
              author={post.author} 
              createdAt={post.createdAt} 
            />

            <p className="forum-post-card__content">{post.content}</p>

            <PostMedia 
              photo={post.photo} 
              document={post.document} 
            />

            <PostActions
              post={post}
              postReactions={postReactions}
              toggleReactions={() => setActiveReactionsPostId(
                activeReactionsPostId === post._id ? null : post._id
              )}
              toggleComments={() => setActiveCommentsPostId(
                activeCommentsPostId === post._id ? null : post._id
              )}
            />

            {activeReactionsPostId === post._id && (
              <ReactionsPanel 
                postId={post._id} 
                postReactions={postReactions} 
              />
            )}

            {activeCommentsPostId === post._id && (
              <ForumPostComment 
                postId={post._id} 
                onCommentAdded={fetchPosts} 
              />
            )}
          </article>
        );
      })}
    </div>
  );
};

export default ForumPost;