import React from 'react';
import './SignIn.css';
import { assets } from '../../assets/assets'; // Assure-toi que assets.sideimage est bien défini

const SignIn = ({ onClose }) => {
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

          <form className="signin-form">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <div className="form-links">
              <a href="#" className="forgot-link">Forgot your password?</a>
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
            Don’t have an account? <a href="#">Join here</a>
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

