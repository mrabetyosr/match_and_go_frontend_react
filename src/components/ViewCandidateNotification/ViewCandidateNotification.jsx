import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ViewCandidateNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1️⃣ Fetch existing notifications
    const fetchNotifications = async () => {
      const { data } = await axios.get("http://localhost:7001/api/notify/my-notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotifications(data.notifications);
    };
    fetchNotifications();

    // 2️⃣ Connect to socket
    const socket = io("http://localhost:7001", { transports: ["websocket"] });

    if (token) {
      const userId = JSON.parse(atob(token.split(".")[1])).id; // decode JWT payload
      socket.emit("register", userId); // ✅ register with backend
    }

    // 3️⃣ Listen for notifications
    socket.on("notification", (notif) => {
      setNotifications((prev) => [
        { message: notif, createdAt: new Date() }, // format same as DB
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>My Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <ul>
        {notifications.map((notif, i) => (
          <li key={i}>
            <p>{notif.message}</p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewCandidateNotification;
