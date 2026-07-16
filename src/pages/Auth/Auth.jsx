import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const initialSignup = { name: '', email: '', password: '', role: 'user' };
const initialLogin = { email: '', password: '' };

function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? false);
  const [form, setForm] = useState(location.state?.isLogin ? initialLogin : { ...initialSignup });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state?.isLogin ?? false;
    setIsLogin(target);
    setForm(target ? { ...initialLogin } : { ...initialSignup });
    setErrors({});
  }, [location.state?.isLogin]);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm((prev) => (prev.email !== undefined ? (prev.name !== undefined ? initialLogin : initialSignup) : (prev.name !== undefined ? initialLogin : initialSignup)));
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

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
      const user = users.find((u) => u.email === form.email && u.password === form.password);
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      localStorage.setItem('sa_user', JSON.stringify({ name: user.name, email: user.email, role: user.role }));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
      if (users.find((u) => u.email === form.email)) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      const newUser = { name: form.name.trim(), email: form.email, password: form.password, role: form.role };
      users.push(newUser);
      localStorage.setItem('sa_users', JSON.stringify(users));
      localStorage.setItem('sa_user', JSON.stringify({ name: newUser.name, email: newUser.email, role: newUser.role }));
      navigate(newUser.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <GlassCard className="auth-card">
        <div className="auth-toggle">
          <div className={`toggle-slider ${isLogin ? '' : 'right'}`} />
          <button type="button" className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => !isLogin && toggleMode()}>
            Sign In
          </button>
          <button type="button" className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => isLogin && toggleMode()}>
            Sign Up
          </button>
        </div>

        <div className="auth-header">
          <h2 className="auth-greeting">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-desc">{isLogin ? 'Sign in to continue learning' : 'Start your learning journey'}</p>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          noValidate
          variants={formVariants}
          initial="hidden"
          animate="visible"
          key={isLogin ? 'login' : 'signup'}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          {!isLogin && (
            <motion.div variants={itemVariants}>
              <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Account Type</label>
              <div className="role-wrap">
                <Shield size={16} color="var(--color-text-muted)" style={{ marginLeft: 'var(--space-2)' }} />
                <label className={`role-option ${form.role === 'user' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} />
                  User
                </label>
                <label className={`role-option ${form.role === 'admin' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} />
                  Admin
                </label>
              </div>
            </motion.div>
          )}

          {!isLogin && (
            <motion.div variants={itemVariants}>
              <Input 
                label="Full Name"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter your full name" 
                autoComplete="name"
                icon={<User size={18} />}
                error={errors.name}
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Input 
              label="Email Address"
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
              autoComplete="email"
              icon={<Mail size={18} />}
              error={errors.email}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div style={{ position: 'relative' }}>
              <Input 
                label="Password"
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                value={form.password} 
                onChange={handleChange} 
                placeholder="Enter your password" 
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                icon={<Lock size={18} />}
                error={errors.password}
              />
              <button 
                type="button" 
                className="toggle-pass" 
                onClick={() => setShowPassword((prev) => !prev)} 
                tabIndex={-1}
                style={{ position: 'absolute', right: '12px', top: '38px' }}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginTop: 'var(--space-2)' }}>
            <Button type="submit" fullWidth variant="primary">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </motion.div>
        </motion.form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span className="switch-link" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default Auth;
