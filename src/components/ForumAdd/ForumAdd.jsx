import React, { useState, useEffect, useRef } from "react";
import { FaImage, FaFileAlt, FaLink, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./ForumAdd.css";

const ForumAdd = () => {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [user, setUser] = useState(null);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // 🔹 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:7001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Insert emoji into textarea
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // ✅ Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ You must be logged in!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", text);
      if (photo) formData.append("photo", photo);
      if (document) formData.append("document", document);
      if (mediaUrl) formData.append("mediaUrl", mediaUrl);

      const res = await fetch("http://localhost:7001/api/users/posts/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Post created!");
        setText("");
        setPhoto(null);
        setDocument(null);
        setMediaUrl("");
        setShowMediaInput(false);
        setShowEmojiPicker(false);

        if (photoInputRef.current) photoInputRef.current.value = "";
        if (docInputRef.current) docInputRef.current.value = "";
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("⚠️ Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="forum-add">
      <div className="forum-add-header">
        {user && (
          <img
            className="user-logo"
            src={`http://localhost:7001/images/${user.logo}`}
            alt="logo"
          />
        )}
        {/* ✅ Textarea with emoji button */}
        <div className="textarea-wrapper">
          <textarea
            className="forum-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start a post..."
          />
          <button
            type="button"
            className="emoji-btn"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <FaSmile />
          </button>

          {/* ✅ Floating emoji picker */}
          {showEmojiPicker && (
            <div className="emoji-popover">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>

      {/* ✅ Link Preview */}
      {mediaUrl && (
        <div className="preview-box">
          <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
            🔗 {mediaUrl}
          </a>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setMediaUrl("")}
          >
            ✖
          </button>
        </div>
      )}

      {/* ✅ Photo Preview */}
      {photo && (
        <div className="preview-box">
          <img
            src={URL.createObjectURL(photo)}
            alt="preview"
            className="preview-img"
          />
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setPhoto(null);
              if (photoInputRef.current) photoInputRef.current.value = "";
            }}
          >
            ✖
          </button>
        </div>
      )}

      {/* ✅ Document Preview */}
      {document && (
        <div className="preview-box">
          {document.type === "application/pdf" ? (
            <iframe
              src={URL.createObjectURL(document)}
              title="PDF Preview"
              className="preview-pdf"
            />
          ) : (
            <div className="doc-preview">📄 {document.name}</div>
          )}
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setDocument(null);
              if (docInputRef.current) docInputRef.current.value = "";
            }}
          >
            ✖
          </button>
        </div>
      )}

      {/* ✅ Bottom action buttons */}
      <div className="forum-add-actions">
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <label className="action-btn">
            <FaImage className="icon" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              ref={photoInputRef}
              style={{ display: "none" }}
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </label>

          <label className="action-btn">
            <FaFileAlt className="icon" />
            <span>Document</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={docInputRef}
              style={{ display: "none" }}
              onChange={(e) => setDocument(e.target.files[0])}
            />
          </label>

          {/* ✅ Media URL */}
          <div className="media-url-section">
            {showMediaInput ? (
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                onBlur={() => setShowMediaInput(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setShowMediaInput(false);
                }}
                placeholder="Paste a link..."
                className="media-url-input"
                autoFocus
              />
            ) : (
              <button
                type="button"
                className="action-btn"
                onClick={() => setShowMediaInput(true)}
              >
                <FaLink className="icon" />
                <span>{mediaUrl ? "Change Link" : "Media URL"}</span>
              </button>
            )}
          </div>
        </div>

        <button type="submit" className="post-btn">
          Post
        </button>
      </div>
    </form>
  );
};

export default ForumAdd;
