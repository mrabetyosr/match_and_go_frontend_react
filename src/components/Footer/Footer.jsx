import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Logo + Social */}
        <div className="footer-logo">
          <h1>🌿 Welcome to Match&Go</h1>
          <div className="social-icons">
            <FaFacebookF />
            <FiX />
            <FaLinkedinIn />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>

        {/* About */}
        <div className="footer-section">
          <h3>ABOUT</h3>
          <ul>
            <li>Concept</li>
            <li>About us</li>
            <li>Jobs</li>
            <li>Help Center</li>
          </ul>
        </div>

        {/* Meet Us */}
        <div className="footer-section">
          <h3>MEET US</h3>
          <ul>
            <li>Press</li>
            <li>Jobs</li>
            <li>Pricing</li>
            <li>Need help?</li>
            <li>Company support</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>THE NEWSLETTER THAT DOES THE JOB</h3>
          <p>
            Relevant advice, Q&As, reports, job openings, and more.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email" />
            <button>Subscribe</button>
          </div>
          <p className="unsubscribe">
            You can unsubscribe whenever you want. <a href="#">Click here</a>.
          </p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <div className="footer-links">
          <span>Legal notice</span>
          <span>Terms of service</span>
          <span>Privacy policy</span>
          <span>Charter</span>
          <span>Manage cookies</span>
        </div>
       
      </div>
    </footer>
  );
};

export default Footer;
