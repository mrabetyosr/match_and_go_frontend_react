import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './PaymentSuccess.css';

// Import du logo
import logoPayment from '../../assets/Match&Gopayment.png';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState('processing');
  const [userInfo, setUserInfo] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      toast.error('Invalid payment session');
      navigate('/register');
      return;
    }
    completeRegistration();
  }, [sessionId, navigate]);

  // Countdown pour redirection automatique
  useEffect(() => {
    if (registrationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (registrationStatus === 'success' && countdown === 0) {
      navigate('/Home');
      window.location.reload();

    }
  }, [registrationStatus, countdown, navigate]);

  const completeRegistration = async () => {
    try {
      setLoading(true);
      setRegistrationStatus('processing');

      // 1. Vérifier le statut du paiement
      const paymentStatusRes = await axios.get(
        `http://localhost:7001/api/auth/payment-status/${sessionId}`
      );

      setPaymentDetails(paymentStatusRes.data);

      if (!paymentStatusRes.data.isCompleted) {
        setRegistrationStatus('failed');
        toast.error('Payment was not completed successfully');
        return;
      }

      // 2. Compléter l'inscription
      const registrationRes = await axios.post(
        'http://localhost:7001/api/auth/complete-registration',
        { sessionId }
      );

      // 3. Succès - sauvegarder le token et les infos utilisateur
      if (registrationRes.data.token) {
        localStorage.setItem('token', registrationRes.data.token);
        setUserInfo(registrationRes.data.user);
        setRegistrationStatus('success');
        toast.success('Registration completed successfully!');
      }

    } catch (error) {
      console.error('Registration completion error:', error);
      setRegistrationStatus('failed');
      
      const errorMessage = error.response?.data?.message || 'Registration completion failed';
      toast.error(errorMessage);
      
      if (errorMessage.includes('already exists')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    navigate('/register');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    navigate('/applications/company');
  };

  // Animation des étapes
  const getStepStatus = (step) => {
    if (registrationStatus === 'processing' && step === 1) return 'active';
    if (registrationStatus === 'success' && step <= 2) return 'completed';
    if (registrationStatus === 'failed' && step === 1) return 'failed';
    return 'pending';
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">

        {/* Logo Match&Go */}
        <div className="payment-logo">
          <img src={logoPayment} alt="Match&Go Payment" />
        </div>
        
        {/* Header avec statut */}
        <div className={`payment-header ${registrationStatus}`}>
          {registrationStatus === 'processing' && (
            <>
              <div className="spinner-large"></div>
              <h1>Processing Your Registration...</h1>
              <p>Please wait while we complete your account setup</p>
            </>
          )}
          
          {registrationStatus === 'success' && (
            <>
              <div className="success-icon">✅</div>
              <h1>Welcome to MatchGo!</h1>
              <p>Your company account has been created successfully</p>
            </>
          )}
          
          {registrationStatus === 'failed' && (
            <>
              <div className="error-icon">❌</div>
              <h1>Registration Failed</h1>
              <p>There was an issue completing your registration</p>
            </>
          )}
        </div>

        {/* Étapes de progression */}
        <div className="progress-steps">
          <div className={`step ${getStepStatus(1)}`}>
            <div className="step-circle">1</div>
            <div className="step-text">
              <h3>Payment Confirmed</h3>
              <p>Stripe payment processed</p>
            </div>
          </div>
          
          <div className="step-connector"></div>
          
          <div className={`step ${getStepStatus(2)}`}>
            <div className="step-circle">2</div>
            <div className="step-text">
              <h3>Account Created</h3>
              <p>Company profile setup</p>
            </div>
          </div>
        </div>

        {/* Détails du paiement */}
        {paymentDetails && (
          <div className="payment-details">
            <h3>💳 Payment Details</h3>
            <div className="payment-info">
              <div className="payment-row">
                <span>Session ID:</span>
                <code>{paymentDetails.sessionId}</code>
              </div>
              <div className="payment-row">
                <span>Amount:</span>
                <strong>${(paymentDetails.amountTotal / 100).toFixed(2)} {paymentDetails.currency?.toUpperCase()}</strong>
              </div>
              <div className="payment-row">
                <span>Status:</span>
                <span className={`status ${paymentDetails.paymentStatus}`}>
                  {paymentDetails.paymentStatus}
                </span>
              </div>
              {paymentDetails.customerEmail && (
                <div className="payment-row">
                  <span>Email:</span>
                  <span>{paymentDetails.customerEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informations utilisateur */}
        {userInfo && registrationStatus === 'success' && (
          <div className="user-info">
            <h3>🏢 Company Profile</h3>
            <div className="user-details">
              <div className="user-row">
                <span>Company Name:</span>
                <strong>{userInfo.username}</strong>
              </div>
              <div className="user-row">
                <span>Email:</span>
                <strong>{userInfo.email}</strong>
              </div>
              <div className="user-row">
                <span>Account Type:</span>
                <span className="role-badge">{userInfo.role}</span>
              </div>
              <div className="user-row">
                <span>Status:</span>
                <span className={`status ${userInfo.isActive ? 'active' : 'inactive'}`}>
                  {userInfo.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="payment-actions">
          {registrationStatus === 'processing' && (
            <div className="processing-message">
              <p>This should only take a few seconds...</p>
            </div>
          )}

          {registrationStatus === 'success' && (
            <>
              <button 
                className="btn-primary" 
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </button>
              <div className="redirect-message">
                <p>You'll be redirected automatically in {countdown} seconds</p>
              </div>
            </>
          )}

          {registrationStatus === 'failed' && (
            <div className="failed-actions">
              <button 
                className="btn-primary" 
                onClick={handleRetryPayment}
              >
                Try Again
              </button>
              <button 
                className="btn-outline" 
                onClick={handleGoToLogin}
              >
                Go to Login
              </button>
              <p className="help-text">
                Need help? Contact our support team at support@matchgo.com
              </p>
            </div>
          )}
        </div>

        {/* Prochaines étapes */}
        {registrationStatus === 'success' && (
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>✅ Complete your company profile</li>
              <li>📝 Post your first job opening</li>
              <li>🔍 Browse and contact candidates</li>
              <li>📊 Access analytics and insights</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="payment-footer">
          <p>
            <strong>Secure Payment:</strong> Processed by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
