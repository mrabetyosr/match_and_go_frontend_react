import React, { useState, useRef } from "react";
import './SignIn.css';
import { assets } from '../../assets/assets';
import { useNavigate } from "react-router-dom"; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanySignUpForm from '../CompanySignUpForm/CompanySignUpForm';
import ReCAPTCHA from "react-google-recaptcha";

const SignIn = ({ onClose }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [step, setStep] = useState("login"); // login | forgot | verify | reset
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailForReset, setEmailForReset] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const recaptchaRef = useRef();

  // --- Helper: reset captcha ---
  const resetCaptcha = () => {
    if (recaptchaRef.current) recaptchaRef.current.reset();
    setCaptchaToken("");
  };

  // --- Normal SignIn / SignUp submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }
    setLoading(true);
    try {
      const url = isSignUp
        ? "http://localhost:7001/api/auth/register"
        : "http://localhost:7001/api/auth/login";

      const body = isSignUp
        ? { username, email, password, role: isCompany ? "company" : "candidate", captchaToken }
        : { email, password, captchaToken };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        toast.error(data.message || (isSignUp ? "Registration failed" : "Login failed"));
        resetCaptcha();
        setLoading(false);
        return;
      }

      if (isSignUp) {
        toast.success(data.message || "✅ Registration successful!");
        setIsSignUp(false);
        setIsCompany(false);
      } else {
        const token = data.token;
        if (token) localStorage.setItem("token", token);

        let role = data.role || data.user?.role;
        if (!role && token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role = payload.role || payload.user?.role || (payload.roles && payload.roles[0]);
          } catch (err) {
            console.warn("Could not parse token payload", err);
          }
        }

        console.log("Detected role:", role);

        if (role === "admin") {
          toast.success("✅ Welcome Admin!");
          resetCaptcha();
          setTimeout(() => {
            try {
              navigate("/admin");
            } catch (err) {
              window.location.href = "http://localhost:3000/admin";
            }
          }, 300);
        } else {
          toast.success("✅ Login success!");
          resetCaptcha();
          setTimeout(() => onClose(true), 800);
        }
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

  // --- Forgot Password ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to send reset code");
        setLoading(false);
        return;
      }
      toast.success("📧 Check your email for the verification code!");
      setEmailForReset(email);
      setStep("verify");
      resetCaptcha();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Verify Code ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7001/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForReset, code: verificationCode, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid verification code");
        setLoading(false);
        return;
      }
      toast.success("✅ Code verified! Now set your new password");
      setStep("reset");
      resetCaptcha();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForReset, code: verificationCode, newPassword, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to reset password");
        setLoading(false);
        return;
      }
      toast.success("✅ Password reset successful! You can login now");
      setStep("login");
      setEmail("");
      setVerificationCode("");
      setNewPassword("");
      resetCaptcha();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Company Registration Mode ---
  if (isCompany) {
    return (
      <div className="auth-modal-container">
        <div className="auth-modal-card">
          <button className="auth-modal-close-btn" onClick={() => onClose(false)}>✕</button>
          <div className="auth-modal-image-section">
            <img src={assets.sideimage} alt="Illustration" className="auth-modal-side-image" />
          </div>
          <div className="auth-modal-form-section">
            <img src={assets.namelogo} alt="Logo" className="auth-modal-brand-logo" />
            <h2 className="auth-modal-heading-company">Company Registration</h2>

            <CompanySignUpForm
              onClose={({ success }) => {
                if (success) {
                  setIsCompany(false);
                  setIsSignUp(false);
                  toast.success("You can now log in!");
                }
              }}
              captchaRef={recaptchaRef}
              setCaptchaToken={setCaptchaToken}
              captchaToken={captchaToken}
            />

            <p className="auth-modal-switch-text">
              Not a recruiter?{" "}
              <span onClick={() => setIsCompany(false)} className="auth-modal-link-clickable">
                Back to Candidate
              </span>
            </p>

            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="normal"
              onChange={(token) => setCaptchaToken(token)}
              ref={recaptchaRef}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- Main Candidate Form ---
  return (
    <div className="auth-modal-container">
      <div className="auth-modal-card">
        <button className="auth-modal-close-btn" onClick={() => onClose(false)}>✕</button>

        <div className="auth-modal-image-section">
          <img src={assets.sideimage} alt="Illustration" className="auth-modal-side-image" />
        </div>

        <div className="auth-modal-form-section">
          <img src={assets.namelogo} alt="Logo" className="auth-modal-brand-logo" />

          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            size="normal"
            onChange={(token) => setCaptchaToken(token)}
            ref={recaptchaRef}
          />

          {step === "login" && (
            <>
              <h2 className="auth-modal-heading-main">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
              <form className="auth-modal-form" onSubmit={handleSubmit}>
                {isSignUp && (
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="auth-modal-input-field"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-modal-input-field"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-modal-input-field"
                />
                {!isSignUp && (
                  <div className="auth-modal-links-wrapper">
                    <span onClick={() => setStep("forgot")} className="auth-modal-forgot-link">
                      Forgot your password?
                    </span>
                  </div>
                )}
                <button type="submit" disabled={loading} className="auth-modal-submit-btn">
                  {loading ? (isSignUp ? "Registering..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
                </button>
              </form>
              {isSignUp && (
                <p className="auth-modal-recruiter-text">
                  I'm a recruiter?{" "}
                  <span onClick={() => setIsCompany(true)} className="auth-modal-link-clickable">
                    Click here
                  </span>
                </p>
              )}
              <p className="auth-modal-switch-text">
                {isSignUp ? (
                  <>Already have an account?{" "}
                    <span onClick={() => setIsSignUp(false)} className="auth-modal-link-clickable">
                      Sign in
                    </span>
                  </>
                ) : (
                  <>Don't have an account?{" "}
                    <span onClick={() => setIsSignUp(true)} className="auth-modal-link-clickable">
                      Sign up
                    </span>
                  </>
                )}
              </p>
            </>
          )}

          {step === "forgot" && (
            <>
              <h2 className="auth-modal-heading-main">Forgot Password</h2>
              <form className="auth-modal-form" onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-modal-input-field"
                />
                <button type="submit" disabled={loading} className="auth-modal-submit-btn">
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
              <p className="auth-modal-switch-text">
                <span onClick={() => setStep("login")} className="auth-modal-link-clickable">
                  Back to Login
                </span>
              </p>
            </>
          )}

          {step === "verify" && (
            <>
              <h2 className="auth-modal-heading-main">Verify Code</h2>
              <form className="auth-modal-form" onSubmit={handleVerifyCode}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="auth-modal-input-field"
                />
                <button type="submit" disabled={loading} className="auth-modal-submit-btn">
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <h2 className="auth-modal-heading-main">Reset Password</h2>
              <form className="auth-modal-form" onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="auth-modal-input-field"
                />
                <button type="submit" disabled={loading} className="auth-modal-submit-btn">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;