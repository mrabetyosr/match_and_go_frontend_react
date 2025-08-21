import React, { useState } from 'react';
import './SignIn.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:7001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

    
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

  
      toast.success("✅ Login success!");
      setTimeout(() => onClose(true), 800);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <button className="close-btn" onClick={() => onClose(false)}>✕</button>

        {/* Partie gauche avec image */}
        <div className="signin-left">
          <img src={assets.sideimage} alt="Illustration" className="signin-image" />
        </div>

        {/* Partie droite avec formulaire */}
        <div className="signin-right">
          <img src={assets.namelogo} alt="Logo" className="signin-logo" />
          <h2 className="signin-title">Welcome Back</h2>

          <form className="signin-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />

            <div className="form-links">
              <Link to="/forgot-password" className="forgot-link">Forgot your password?</Link>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {/* ⚡ Container pour les toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default SignIn;
