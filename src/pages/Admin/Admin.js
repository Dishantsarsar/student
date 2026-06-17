import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
  const current = JSON.parse(localStorage.getItem('sa_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('sa_user');
    navigate('/');
  };

  if (!current || current.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h2>Access Denied</h2>
          <p>You do not have admin privileges.</p>
          <button className="admin-btn" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <div className="admin-card admin-wide">
        <div className="admin-head">
          <div>
            <h2>Admin Dashboard</h2>
            <p className="admin-sub">Welcome, {current.name}</p>
          </div>
          <button className="admin-logout" onClick={handleLogout}>Logout</button>
        </div>

        <div className="admin-stat">
          <div className="stat-box">
            <span className="stat-num">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">{users.filter((u) => u.role === 'admin').length}</span>
            <span className="stat-label">Admins</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">{users.filter((u) => u.role === 'user').length}</span>
            <span className="stat-label">Users</span>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="3" className="empty-row">No users registered yet</td></tr>
            )}
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
