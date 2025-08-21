import React from 'react';
import './SignIn.css';
import { assets } from '../../assets/assets'; // Assure-toi que assets.sideimage est bien défini
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import de Link pour la navigation


const SignIn = ({ onClose }) => {
  const [email, setEmail] = useState("");  // ⚡ Utiliser email
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
      onClose(); // fermer la modal
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };
  return (
    <div className="signin-container">
      <div className="signin-card">
        {/* ✅ Bouton de fermeture dans la card */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Partie gauche : image */}
        <div className="signin-left">
          <img src={assets.sideimage} alt="Illustration" className="signin-image" />
        </div>

        {/* Partie droite : formulaire */}
        <div className="signin-right">
          <img src={assets.namelogo} alt="Logo" className="signin-logo" />
          <h2 className="signin-title">Welcome Back</h2>

          <form className="signin-form"onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required/>
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
               {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="form-links">
              <Link to="/forgot-password" className="forgot-link">Forgot your password? </Link>
            </div>
            <button type="submit">Login</button>
          </form>

          <div className="signin-socials">
            <p>Or sign in with</p>
            <div className="social-buttons">
              <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer">
                <button className="social-btn">
                  <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" />
                </button>
              </a>
              <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer">
                <button className="social-btn">
                  <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" />
                </button>
              </a>
            </div>
          </div>

          <div className="signup-link">
            Don’t have an account? <Link to="/signup">Join here</Link>
          </div>

          <p className="terms-text">
            By joining, you agree to the <strong>MATCH&GO Terms of Service</strong> and to occasionally receive emails from us.
            <br />
            Please read our <strong>Privacy Policy</strong> to learn how we use your personal data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

