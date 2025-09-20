import React, { useEffect, useState } from "react";
import axios from "axios";
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

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:7001/api/users/posts", { headers });
      setPosts(res.data);

      const reactionsPromises = res.data.map((post) =>
        axios
          .get(`http://localhost:7001/api/users/posts/${post._id}/reactions`, { headers })
          .then((res) => ({ [post._id]: res.data }))
      );
      const allReactions = await Promise.all(reactionsPromises);
      setReactionsData(Object.assign({}, ...allReactions));
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

  if (loading) {
    return (
      <div className="loading-container">
        <HandLoader size={100} />
        <p className="loading-text">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) return <p>Aucun post disponible.</p>;

  return (
    <div className="forum-container">
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
          <div key={post._id} className="post-card">
            <p className="post-content">{post.content}</p>

            {post.photo && (
              <div className="post-photo">
                <img src={`http://localhost:7001${post.photo}`} alt="post" />
              </div>
            )}
            {post.document && (
              <div className="post-document">
                <a href={`http://localhost:7001${post.document}`} target="_blank" rel="noopener noreferrer">
                  Voir le document
                </a>
              </div>
            )}

            <div className="post-actions">
              <button className="btn-share" onClick={() => handleShare(post._id)}>
                🔁 {post.sharesCount || 0}
              </button>

              <button
                className="btn-reactions"
                title={tooltipContent || "Aucune réaction"}
                onClick={() =>
                  setShowReactionsPostId(showReactionsPostId === post._id ? null : post._id)
                }
              >
                {reactedTypes.map((type) => reactionsMap[type]).join(" ")} {totalReactions > 0 ? `(${totalReactions})` : ""}
              </button>

              <button
                className="btn-comments"
                onClick={() =>
                  setShowCommentsPostId(showCommentsPostId === post._id ? null : post._id)
                }
              >
                💬 Commentaires ({post.commentsCount || 0})
              </button>
            </div>

            {/* Affichage des réactions avec avatars */}
            {showReactionsPostId === post._id && (
              <div className="reactions-list">
                <ForumPostReaction postId={post._id} onReaction={fetchPosts} />
                <div className="reactions-users">
                  {Object.entries(postReactions).map(([type, data]) => {
                    if (!data.users || data.users.length === 0) return null;
                    return (
                      <div key={type} className="reaction-type-group">
                        <strong>{reactionsMap[type]}</strong>
                        <div className="reaction-users">
                          {data.users.map((user) => (
                            <div key={user._id} className="reaction-user">
                              <img
                                src={`http://localhost:7001/images/${user.logo || "user.png"}`}
                                alt={user.username}
                                className="reaction-user-avatar"
                              />
                              <span>{user.username}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Affichage des commentaires */}
            {showCommentsPostId === post._id && (
              <ForumPostComment postId={post._id} onCommentAdded={fetchPosts} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ForumPost;
