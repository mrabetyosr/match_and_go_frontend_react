import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { io } from "socket.io-client";
import "./ApplicationUser.css";

const ApplicationUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:7001/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error("Error loading user info.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch notifications + socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get("http://localhost:7001/api/notify/my-notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setNotifications(data.notifications);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();

    const socket = io("http://localhost:7001", { transports: ["websocket"] });
    if (token) {
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      socket.emit("register", userId);
    }
    socket.on("notification", (notif) => {
      setNotifications((prev) => [{ message: notif, createdAt: new Date() }, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="au-application-user">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="au-header-user">
        <div className="au-logo-user">
          <img
            src={user.image_User ? `http://localhost:7001/images/${user.image_User}` : "/defaultAvatar.png"}
            alt="Logo"
            className="au-logo"
          />
          <span className="au-username">{user.username}</span>
        </div>

        <div className="au-button-container" ref={dropdownRef}>
          <Link to="/applications/user/applications">
            <button>📄 Applications</button>
          </Link>
          <Link to="/applications/user/posts">
            <button>📝 Posts</button>
          </Link>

          {/* Notification dropdown */}
          <button onClick={() => setShowDropdown((prev) => !prev)}>
            🔔 {notifications.length > 0 && <span className="au-notif-count">{notifications.length}</span>}
          </button>
          {showDropdown && (
            <div className="au-dropdown">
              {notifications.length === 0 ? (
                <p className="au-empty">No notifications</p>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="au-notif-item">
                    <p>{n.message}</p>
                    <small>{new Date(n.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenu onglets */}
      <div className="au-tab-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ApplicationUser;
