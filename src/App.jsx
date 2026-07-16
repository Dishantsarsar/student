import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import CommandPalette from './components/ui/CommandPalette';
import InteractiveBackground from './components/ui/InteractiveBackground';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import About from './pages/About/About';
import Courses from './pages/Courses/Courses';
import Contact from './pages/Contact/Contact';
import Admin from './pages/Admin/Admin';

import DashboardLayout from './components/layout/DashboardLayout';
import DashboardView from './pages/Dashboard/DashboardView';
import CourseCatalogView from './pages/Dashboard/CourseCatalogView';
import CourseView from './pages/Dashboard/CourseView';
import CommunityView from './pages/Dashboard/CommunityView';
import SettingsView from './pages/Dashboard/SettingsView';
import './App.css';

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.8, 0.25, 1],
};

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/* Animated routes wrapper */
function AnimatedRoutes() {
  const location = useLocation();

  /* Scroll to top on every route change */
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-transition"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ width: '100%', height: '100%' }}
      >
        <Routes location={location}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="courses" element={<CourseCatalogView />} />
            <Route path="courses/:id" element={<CourseView />} />
            <Route path="community" element={<CommunityView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>

          <Route path="/admin" element={<Admin />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <InteractiveBackground />
            <div className="app">
              <CommandPalette />
              <AnimatedRoutes />
            </div>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
