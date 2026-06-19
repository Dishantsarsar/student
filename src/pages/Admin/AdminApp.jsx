import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Students from './pages/Students/Students.jsx';
import Courses from './pages/Courses/Courses.jsx';
import Categories from './pages/Categories/Categories.jsx';
import Enrollments from './pages/Enrollments/Enrollments.jsx';
import Certificates from './pages/Certificates/Certificates.jsx';
import Reviews from './pages/Reviews/Reviews.jsx';
import Support from './pages/Support/Support.jsx';
import Reports from './pages/Reports/Reports.jsx';
import WebsiteSettings from './pages/WebsiteSettings/WebsiteSettings.jsx';
import Profile from './pages/Profile/Profile.jsx';

function AdminApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="courses" element={<Courses />} />
        <Route path="categories" element={<Categories />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="support" element={<Support />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<WebsiteSettings />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminApp;
