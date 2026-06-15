import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const countryToDialCode = {
  IN: '+91', US: '+1', CA: '+1', GB: '+44', AU: '+61', DE: '+49', FR: '+33',
  JP: '+81', CN: '+86', BR: '+55', ZA: '+27', RU: '+7', MX: '+52', ES: '+34',
  IT: '+39', KR: '+82', SG: '+65', MY: '+60', ID: '+62', TH: '+66', PH: '+63',
  VN: '+84', PK: '+92', BD: '+880', LK: '+94', NP: '+977', AE: '+971', SA: '+966',
  NZ: '+64', NL: '+31', CH: '+41', SE: '+46', NO: '+47', DK: '+45', FI: '+358',
  IE: '+353', BE: '+32', AT: '+43', PL: '+48', TR: '+90', EG: '+20', IL: '+972'
};

const initialSignup = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  phoneDialCode: '+91',
  phoneNumber: '',
  experience: '',
  qualification: '',
  qualificationProof: '',
  qualificationProofName: '',
  institution: ''
};
const initialLogin = { email: '', password: '' };

function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? false);
  const [form, setForm] = useState(location.state?.isLogin ? initialLogin : initialSignup);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const navigate = useNavigate();

  // Initialize users and seed default accounts, ensuring existing cache updates to Teacher
  useEffect(() => {
    const storedUsersStr = localStorage.getItem("users");
    let users = [];
    if (storedUsersStr) {
      try {
        users = JSON.parse(storedUsersStr);
      } catch (e) {
        console.error("Failed to parse stored users", e);
      }
    }

    let updatedUsers = [...users];

    // 1. Check/add Admin
    let adminIdx = updatedUsers.findIndex(u => u.email.toLowerCase() === "admin@solutionadda.com");
    if (adminIdx >= 0) {
      updatedUsers[adminIdx].role = "admin";
    } else {
      updatedUsers.push({
        name: "System Admin",
        email: "admin@solutionadda.com",
        password: "admin123",
        role: "admin"
      });
    }

    // 2. Check/add Teacher
    let teacherIdx = updatedUsers.findIndex(u => u.email.toLowerCase() === "teacher@solutionadda.com");
    if (teacherIdx >= 0) {
      updatedUsers[teacherIdx].role = "teacher";
      if (!updatedUsers[teacherIdx].phoneNumber) {
        updatedUsers[teacherIdx].phoneDialCode = "+91";
        updatedUsers[teacherIdx].phoneNumber = "9876543210";
        updatedUsers[teacherIdx].experience = "8";
        updatedUsers[teacherIdx].qualification = "M.Tech Computer Science";
        updatedUsers[teacherIdx].qualificationProof = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwZjJmZSIvPjx0ZXh0IHg9IjEwIiB5PSI1MCIgZmlsbD0iIzBhMGExYSIgZm9udC1zaXplPSIxMiI+REVNTyBQUk9PRjwvdGV4dD48L3N2Zz4=";
        updatedUsers[teacherIdx].qualificationProofName = "demo_degree.svg";
        updatedUsers[teacherIdx].institution = "IIT Bombay";
        updatedUsers[teacherIdx].verified = true;
      }
    } else {
      updatedUsers.push({
        name: "Demo Teacher",
        email: "teacher@solutionadda.com",
        password: "teacher123",
        role: "teacher",
        phoneDialCode: "+91",
        phoneNumber: "9876543210",
        experience: "8",
        qualification: "M.Tech Computer Science",
        qualificationProof: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwZjJmZSIvPjx0ZXh0IHg9IjEwIiB5PSI1MCIgZmlsbD0iIzBhMGExYSIgZm9udC1zaXplPSIxMiI+REVNTyBQUk9PRjwvdGV4dD48L3N2Zz4=",
        qualificationProofName: "demo_degree.svg",
        institution: "IIT Bombay",
        verified: true
      });
    }

    // 3. Check/add Student
    let studentIdx = updatedUsers.findIndex(u => u.email.toLowerCase() === "student@solutionadda.com");
    if (studentIdx >= 0) {
      updatedUsers[studentIdx].role = "user";
    } else {
      updatedUsers.push({
        name: "Demo Student",
        email: "student@solutionadda.com",
        password: "student123",
        role: "user"
      });
    }

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }, []);

  const detectCountryCode = async () => {
    setDetectingLocation(true);
    setLocationStatus("Detecting GPS...");

    const applyCountryCode = (countryCode) => {
      const code = countryToDialCode[countryCode.toUpperCase()] || '+1';
      setForm((prev) => ({ ...prev, phoneDialCode: code }));
      setLocationStatus(`Code: ${code} (${countryCode})`);
    };

    const fallbackIPLocation = async () => {
      setLocationStatus("GPS blocked/timed out. Trying IP...");
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code) {
          applyCountryCode(data.country_code);
        } else {
          setLocationStatus("Could not verify country. Defaulting.");
        }
      } catch (e) {
        console.error("IP geolocation failed", e);
        setLocationStatus("Could not verify country. Defaulting.");
      } finally {
        setDetectingLocation(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            if (data.countryCode) {
              applyCountryCode(data.countryCode);
            } else {
              await fallbackIPLocation();
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
            await fallbackIPLocation();
          } finally {
            setDetectingLocation(false);
          }
        },
        async (error) => {
          console.warn("GPS Geolocation failed or denied, trying IP fallback...", error);
          await fallbackIPLocation();
        },
        { timeout: 5000 }
      );
    } else {
      await fallbackIPLocation();
    }
  };

  useEffect(() => {
    if (!isLogin && form.role === 'teacher') {
      detectCountryCode();
    }
  }, [form.role, isLogin]);

  useEffect(() => {
    const target = location.state?.isLogin ?? false;
    setIsLogin(target);
    setForm(target ? initialLogin : initialSignup);
    setErrors({});
  }, [location.state?.isLogin]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setErrors((prev) => ({ ...prev, qualificationProof: "Proof file must be under 1MB." }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          qualificationProof: reader.result,
          qualificationProofName: file.name
        }));
        if (errors.qualificationProof) {
          setErrors((prev) => ({ ...prev, qualificationProof: "" }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && (!form.name || !form.name.trim())) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';

    if (!isLogin && form.role === 'teacher') {
      if (!form.phoneNumber || !form.phoneNumber.trim()) {
        errs.phoneNumber = 'Phone number is required';
      } else if (!/^\d{7,15}$/.test(form.phoneNumber.trim())) {
        errs.phoneNumber = 'Enter valid phone number (7-15 digits)';
      }
      if (!form.experience || isNaN(form.experience) || parseInt(form.experience) < 0) {
        errs.experience = 'Experience must be a positive number';
      }
      if (!form.qualification || !form.qualification.trim()) {
        errs.qualification = 'Highest qualification is required';
      }
      if (!form.qualificationProof) {
        errs.qualificationProof = 'Qualification proof document is required';
      }
      if (!form.institution || !form.institution.trim()) {
        errs.institution = 'Institution is required';
      }
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (isLogin) {
      let currentUsers = [...storedUsers];
      let hasUpdates = false;

      if (form.email.toLowerCase() === "teacher@solutionadda.com" && form.password === "teacher123") {
        if (!currentUsers.some((u) => u.email.toLowerCase() === "teacher@solutionadda.com")) {
          currentUsers.push({
            name: "Demo Teacher",
            email: "teacher@solutionadda.com",
            password: "teacher123",
            role: "teacher",
            phoneDialCode: "+91",
            phoneNumber: "9876543210",
            experience: "8",
            qualification: "M.Tech Computer Science",
            qualificationProof: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwZjJmZSIvPjx0ZXh0IHg9IjEwIiB5PSI1MCIgZmlsbD0iIzBhMGExYSIgZm9udC1zaXplPSIxMiI+REVNTyBQUk9PRjwvdGV4dD48L3N2Zz4=",
            qualificationProofName: "demo_degree.svg",
            institution: "IIT Bombay",
            verified: true
          });
          hasUpdates = true;
        }
      } else if (form.email.toLowerCase() === "student@solutionadda.com" && form.password === "student123") {
        if (!currentUsers.some((u) => u.email.toLowerCase() === "student@solutionadda.com")) {
          currentUsers.push({
            name: "Demo Student",
            email: "student@solutionadda.com",
            password: "student123",
            role: "user"
          });
          hasUpdates = true;
        }
      } else if (form.email.toLowerCase() === "admin@solutionadda.com" && form.password === "admin123") {
        if (!currentUsers.some((u) => u.email.toLowerCase() === "admin@solutionadda.com")) {
          currentUsers.push({
            name: "System Admin",
            email: "admin@solutionadda.com",
            password: "admin123",
            role: "admin"
          });
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        localStorage.setItem("users", JSON.stringify(currentUsers));
      }

      const user = currentUsers.find(
        (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
      );
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "teacher") {
          navigate("/teacher");
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrors({ auth: "Invalid email or password." });
      }
    } else {
      const exists = storedUsers.some((u) => u.email.toLowerCase() === form.email.toLowerCase());
      if (exists) {
        setErrors({ email: "Email already registered." });
        return;
      }
      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role || "user",
        ...(form.role === "teacher" ? {
          phoneDialCode: form.phoneDialCode,
          phoneNumber: form.phoneNumber,
          experience: form.experience,
          qualification: form.qualification,
          qualificationProof: form.qualificationProof,
          qualificationProofName: form.qualificationProofName,
          institution: form.institution,
          verified: true
        } : {})
      };
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      localStorage.setItem("user", JSON.stringify(newUser));

      if (newUser.role === "admin") {
        navigate("/admin");
      } else if (newUser.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/dashboard");
      }
    }
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

          {!isLogin && (
            <div className="field">
              <label>Select Role</label>
              <div className="field-wrap">
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange} 
                  className="role-select-input"
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1.5px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    fontFamily: "inherit",
                    fontSize: "0.92rem",
                    color: "#fff",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="user" style={{ background: "#0a0a1a", color: "#fff" }}>Student</option>
                  <option value="teacher" style={{ background: "#0a0a1a", color: "#fff" }}>Teacher</option>
                </select>
              </div>
            </div>
          )}

          {!isLogin && form.role === 'teacher' && (
            <>
              <div className={`field ${errors.phoneNumber ? 'error' : ''}`}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verification Phone Number *</span>
                  {locationStatus && (
                    <span style={{ fontSize: '0.72rem', color: '#00f2fe', fontWeight: 'normal' }}>
                      {detectingLocation ? '🔄 ' : '📍 '} {locationStatus}
                    </span>
                  )}
                </label>
                <div className="field-wrap" style={{ gap: '10px' }}>
                  <select
                    name="phoneDialCode"
                    value={form.phoneDialCode}
                    onChange={handleChange}
                    style={{
                      width: '35%',
                      padding: '14px 10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      fontFamily: 'inherit',
                      fontSize: '0.92rem',
                      color: '#fff',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {Object.entries(countryToDialCode).map(([country, code]) => (
                      <option key={country} value={code} style={{ background: '#0a0a1a', color: '#fff' }}>
                        {country} ({code})
                      </option>
                    ))}
                  </select>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    style={{ width: '65%', paddingLeft: '15px' }}
                  />
                </div>
                {errors.phoneNumber && <span className="field-err">{errors.phoneNumber}</span>}
              </div>

              <div className={`field ${errors.experience ? 'error' : ''}`}>
                <label>Teaching Experience (Years) *</label>
                <div className="field-wrap">
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    style={{ paddingLeft: '15px' }}
                  />
                </div>
                {errors.experience && <span className="field-err">{errors.experience}</span>}
              </div>

              <div className={`field ${errors.qualification ? 'error' : ''}`}>
                <label>Highest Qualification / Degree *</label>
                <div className="field-wrap">
                  <input
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="e.g. PhD in Computer Science"
                    style={{ paddingLeft: '15px' }}
                  />
                </div>
                {errors.qualification && <span className="field-err">{errors.qualification}</span>}
              </div>

              <div className={`field ${errors.qualificationProof ? 'error' : ''}`}>
                <label>Highest Qualification / Degree Certificate Proof *</label>
                <div 
                  className="field-wrap"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '2px dashed ' + (errors.qualificationProof ? 'rgba(252, 0, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'),
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = errors.qualificationProof ? 'rgba(252, 0, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
                >
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📂</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>
                    {form.qualificationProofName ? `Selected: ${form.qualificationProofName}` : 'Click to Upload Document / Image'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    Supports PNG, JPG, PDF (Max 1MB)
                  </span>
                </div>
                {errors.qualificationProof && <span className="field-err">{errors.qualificationProof}</span>}
              </div>

              <div className={`field ${errors.institution ? 'error' : ''}`}>
                <label>University / Institution *</label>
                <div className="field-wrap">
                  <input
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    placeholder="e.g. Stanford University"
                    style={{ paddingLeft: '15px' }}
                  />
                </div>
                {errors.institution && <span className="field-err">{errors.institution}</span>}
              </div>
            </>
          )}

          {errors.auth && <span className="field-err" style={{ textAlign: "center", display: "block" }}>{errors.auth}</span>}

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


