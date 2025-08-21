import React, { useState } from 'react';
import './SignIn.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const SignIn = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        setError(data.message || "Login failed");
        return;
      }

      // Sauvegarde du token JWT
      localStorage.setItem("token", data.token);

      alert("✅ Login success!");
      onClose(true); // ⚡ dire à NavBar que login est réussi
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <button className="close-btn" onClick={() => onClose(false)}>✕</button>

        <div className="signin-left">
          <img src={assets.sideimage} alt="Illustration" className="signin-image" />
        </div>

        <div className="signin-right">
          <img src={assets.namelogo} alt="Logo" className="signin-logo" />
          <h2 className="signin-title">Welcome Back</h2>

          <form className="signin-form" onSubmit={handleSubmit}>
            <input 
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required 
            />
            <input 
              type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required 
            />
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="form-links">
              <Link to="/forgot-password" className="forgot-link">Forgot your password?</Link>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
