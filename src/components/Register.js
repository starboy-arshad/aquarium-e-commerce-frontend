import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: Password
  const { signupInit, verifySignupOTP, signupComplete, loading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInitSignup = async (e) => {
    e.preventDefault();
    const result = await signupInit(name, email, phone);
    if (result && !result.message.includes('error') && !error) {
      setStep(2);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const result = await verifySignupOTP(email, otp);
    if (result && !result.message.includes('error') && !error) {
      setStep(3);
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await signupComplete(email, password, otp);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-container">
          <h2>
            {step === 1 && 'Sign Up'}
            {step === 2 && 'Verify Email'}
            {step === 3 && 'Create Password'}
          </h2>
          {error && <div className="error-message">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleInitSignup} className="register-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="register-form">
              <p>Please enter the 6-digit OTP sent to <strong>{email}</strong></p>
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
              </div>
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                className="btn-link mt-2"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
              >
                Back to Details
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleCompleteSignup} className="register-form">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create your password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Completing Sign Up...' : 'Sign Up'}
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="register-links">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
