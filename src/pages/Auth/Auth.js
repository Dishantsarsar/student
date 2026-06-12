import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

const initialSignup = { name: '', email: '', password: '' };
const initialLogin = { email: '', password: '' };

function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState(initialSignup);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm((prev) => (prev === initialLogin ? initialSignup : initialLogin));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && (!form.name || !form.name.trim())) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    console.log('Submitted:', form);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="auth-card">
        <div className="auth-toggle">
          <div className={`toggle-slider ${isLogin ? '' : 'right'}`} />
          <button type="button" className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => isLogin && toggleMode()}>
            Sign In
          </button>
          <button type="button" className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => !isLogin && toggleMode()}>
            Sign Up
          </button>
        </div>

        <div className="auth-header">
          <h2 className="auth-greeting">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-desc">{isLogin ? 'Sign in to continue learning' : 'Start your learning journey'}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className={`field ${errors.name ? 'error' : ''}`}>
              <label>Full Name</label>
              <div className="field-wrap">
                <span className="field-icon"><UserIcon /></span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" />
              </div>
              {errors.name && <span className="field-err">{errors.name}</span>}
            </div>
          )}

          <div className={`field ${errors.email ? 'error' : ''}`}>
            <label>Email Address</label>
            <div className="field-wrap">
              <span className="field-icon"><MailIcon /></span>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" autoComplete="email" />
            </div>
            {errors.email && <span className="field-err">{errors.email}</span>}
          </div>

          <div className={`field ${errors.password ? 'error' : ''}`}>
            <label>Password</label>
            <div className="field-wrap">
              <span className="field-icon"><LockIcon /></span>
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete={isLogin ? 'current-password' : 'new-password'} />
              <button type="button" className="toggle-pass" onClick={() => setShowPassword((prev) => !prev)} tabIndex={-1}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && <span className="field-err">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-auth">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span className="switch-link" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
