import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './frontend/components/Navbar/Navbar';
import Footer from './frontend/components/Footer/Footer';
import Home from './frontend/pages/Home/Home';
import Courses from './frontend/pages/Courses/Courses';
import Auth from './frontend/pages/Auth/Auth';
import About from './frontend/pages/About/About';
import UserDashboard from './frontend/pages/Dashboard/UserDashboard';
import TeacherDashboard from './frontend/pages/Dashboard/TeacherDashboard';
import AdminDashboard from './frontend/pages/Dashboard/AdminDashboard';
import Chatbot from './frontend/components/Chatbot/Chatbot';
import './App.css';

// Route Guard component to secure student, teacher and admin dashboards
function ProtectedRoute({ children, allowedRoles }) {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return <Navigate to="/auth" state={{ isLogin: true }} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to={user.role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
    }
  } catch (e) {
    return <Navigate to="/auth" state={{ isLogin: true }} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
