import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import CommandPalette from './components/ui/CommandPalette';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import Auth from './pages/Auth/Auth';
import About from './pages/About/About';
import Admin from './pages/Admin/Admin';
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

/* Animated routes wrapper */
function AnimatedRoutes() {
  const location = useLocation();

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
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}


function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="app">
            <CommandPalette />
            <Navbar />
            <main className="main-content">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
