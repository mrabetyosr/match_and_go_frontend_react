import React, { useState } from 'react';
import './SignIn.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanySignUpForm from '../CompanySignUpForm/CompanySignUpForm'; // <-- IMPORT CORRECT

const SignIn = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isSignUp
      ? "http://localhost:7001/api/auth/register"
      : "http://localhost:7001/api/auth/login";

    const body = isSignUp
      ? { username, email, password, role: isCompany ? "company" : "candidate" }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || (isSignUp ? "Registration failed" : "Login failed"));
        setLoading(false);
        return;
      }

      if (isSignUp) {
        toast.success(data.message || "✅ Registration successful!");
        setIsSignUp(false);
        setIsCompany(false);
      } else {
        localStorage.setItem("token", data.token);
        toast.success("✅ Login success!");
        setTimeout(() => onClose(true), 800);
      }

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Si mode company, afficher le CompanySignUpForm ---
  if (isCompany) {
    return (
      <div className="signin-container">
        <div className="signin-card">
          <button className="close-btn" onClick={() => onClose(false)}>✕</button>

          <div className="signin-left">
            <img src={assets.sideimage} alt="Illustration" className="signin-image" />
          </div>

          <div className="signin-right">
            <img src={assets.namelogo} alt="Logo" className="signin-logo" />
            <h2 className="signin-title">Company Registration</h2>

            <CompanySignUpForm onClose={onClose} />

            <p className="signup-text">
              Not a recruiter?{" "}
              <span onClick={() => setIsCompany(false)} className="signup-link btn-link">
                Back to Candidate
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Sinon mode normal SignIn / SignUp ---
  return (
    <div className="signin-container">
      <div className="signin-card">
        <button className="close-btn" onClick={() => onClose(false)}>✕</button>

        <div className="signin-left">
          <img src={assets.sideimage} alt="Illustration" className="signin-image" />
        </div>

        <div className="signin-right">
          <img src={assets.namelogo} alt="Logo" className="signin-logo" />
          <h2 className="signin-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>

          <form className="signin-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
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

            {!isSignUp && (
              <div className="form-links">
                <a href="/forgot-password" className="forgot-link">Forgot your password?</a>
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? (isSignUp ? "Registering..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
            </button>
          </form>

          {/* Lien “I’m a recruiter?” */}
          {isSignUp && !isCompany && (
            <p className="company-text">
              I'm a recruiter?{" "}
              <span onClick={() => setIsCompany(true)} className="signup-link btn-link">
                Click here
              </span>
            </p>
          )}

          <p className="signup-text">
            {isSignUp ? (
              <>Already have an account?{" "}
                <span onClick={() => { setIsSignUp(false); setIsCompany(false); }} className="signup-link btn-link">
                  Sign in
                </span>
              </>
            ) : (
              <>Don't have an account?{" "}
                <span onClick={() => { setIsSignUp(true); setIsCompany(false); }} className="signup-link btn-link">
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;