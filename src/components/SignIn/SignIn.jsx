import React, { useState, useRef } from "react";
import './SignIn.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanySignUpForm from '../CompanySignUpForm/CompanySignUpForm';
import ReCAPTCHA from "react-google-recaptcha";

const SignIn = ({ onClose }) => {
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
      if (!res.ok) {
        toast.error(data.message || (isSignUp ? "Registration failed" : "Login failed"));
        resetCaptcha(); // <-- reset ici
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
      resetCaptcha();
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
      <div className="signin-container">
        <div className="signin-card">
          <button className="close-btn" onClick={() => onClose(false)}>✕</button>
          <div className="signin-left">
            <img src={assets.sideimage} alt="Illustration" className="signin-image" />
          </div>
          <div className="signin-right">
            <img src={assets.namelogo} alt="Logo" className="signin-logo" />
            <h2 className="signin-title">Company Registration</h2>

            {/* Company SignUp Form */}
            <CompanySignUpForm
              onClose={({ success, role }) => {
                if (success) {
                  setIsCompany(false);  // Close the company form
                  setIsSignUp(false);   // Switch to login form
                  toast.success("You can now log in!");
                }
              }}
              captchaRef={recaptchaRef}
              setCaptchaToken={setCaptchaToken}
              captchaToken={captchaToken}
            />

            <p className="signup-text">
              Not a recruiter?{" "}
              <span onClick={() => setIsCompany(false)} className="signup-link btn-link">
                Back to Candidate
              </span>
            </p>

            {/* Google reCAPTCHA */}
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
    <div className="signin-container">
      <div className="signin-card">
        <button className="close-btn" onClick={() => onClose(false)}>✕</button>

        <div className="signin-left">
          <img src={assets.sideimage} alt="Illustration" className="signin-image" />
        </div>

        <div className="signin-right">
          <img src={assets.namelogo} alt="Logo" className="signin-logo" />

          {/* Google reCAPTCHA */}
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            size="normal"
            onChange={(token) => setCaptchaToken(token)}
            ref={recaptchaRef}
          />

          {/* Candidate Login / SignUp */}
          {step === "login" && (
            <>
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
                    <span onClick={() => setStep("forgot")} className="forgot-link">
                      Forgot your password?
                    </span>
                  </div>
                )}
                <button type="submit" disabled={loading}>
                  {loading ? (isSignUp ? "Registering..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
                </button>
              </form>
              {isSignUp && (
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
                    <span onClick={() => setIsSignUp(false)} className="signup-link btn-link">
                      Sign in
                    </span>
                  </>
                ) : (
                  <>Don't have an account?{" "}
                    <span onClick={() => setIsSignUp(true)} className="signup-link btn-link">
                      Sign up
                    </span>
                  </>
                )}
              </p>
            </>
          )}

          {/* Forgot Password */}
          {step === "forgot" && (
            <>
              <h2 className="signin-title">Forgot Password</h2>
              <form className="signin-form" onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
              <p className="signup-text">
                <span onClick={() => setStep("login")} className="signup-link btn-link">
                  Back to Login
                </span>
              </p>
            </>
          )}

          {/* Verify Code */}
          {step === "verify" && (
            <>
              <h2 className="signin-title">Verify Code</h2>
              <form className="signin-form" onSubmit={handleVerifyCode}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            </>
          )}

          {/* Reset Password */}
          {step === "reset" && (
            <>
              <h2 className="signin-title">Reset Password</h2>
              <form className="signin-form" onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
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
