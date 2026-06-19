import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import Auth from './pages/Auth/Auth';
import About from './pages/About/About';
import AdminApp from './pages/Admin/AdminApp.jsx';
import WelcomeBanner from './components/Engagement/WelcomeBanner';
import LiveActivity from './components/Engagement/LiveActivity';
import LearningTips from './components/Engagement/LearningTips';
import StickyBottomCTA from './components/Engagement/StickyBottomCTA';
import ReadingProgress from './components/Engagement/ReadingProgress';
import ContinueLearningReminder from './components/Engagement/ContinueLearningReminder';
import ExitIntent from './components/Engagement/ExitIntent';
import AuthActionModal from './components/AuthModal/AuthActionModal';
import './App.css';

/* Wrapper to conditionally hide student navbar/footer on admin routes */
function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <Footer />

      {/* Global Engagement Components */}
      <WelcomeBanner />
      <LiveActivity />
      <LearningTips />
      <StickyBottomCTA />
      <ReadingProgress />
      <ContinueLearningReminder />
      
      {/* Global Smart Popup logic will be inside AppContent for route access */}
    </div>
  );
}

function AppContentWithEngagement() {
  const [showGlobalAuth, setShowGlobalAuth] = useState(false);
  const [authMode, setAuthMode] = useState('passive');
  const isAuth = !!localStorage.getItem('sa_user');
  const location = useLocation();

  useEffect(() => {
    // 20s site-wide timer for guests
    if (isAuth || sessionStorage.getItem('passive_auth_dismissed')) return;

    const timer = setTimeout(() => {
      setAuthMode('passive');
      setShowGlobalAuth(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [isAuth, location.pathname]);

  const handleExitIntent = () => {
    if (!isAuth && !sessionStorage.getItem('passive_auth_dismissed')) {
      setAuthMode('exitIntent');
      setShowGlobalAuth(true);
    }
  };

  return (
    <>
      <AppContent />
      <ExitIntent onTrigger={handleExitIntent} />
      <AuthActionModal 
        isOpen={showGlobalAuth}
        mode={authMode}
        onClose={() => setShowGlobalAuth(false)}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContentWithEngagement />
    </Router>
  );
}

export default App;
