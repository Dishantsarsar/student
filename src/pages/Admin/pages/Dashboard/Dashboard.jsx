import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, BookOpen, Users, BarChart3, Star, Clock,
} from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import ChartCard, { BarChart, DoughnutChart, AreaChart } from '../../components/ChartCard/ChartCard.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import {
  dashboardStats,
  studentGrowthData,
  coursePopularityData,
  enrollmentTrendData,
  quickActions,
  recentStudents,
  recentCourses,
  recentReviews,
  pendingSupport,
} from '../../data/dashboardData.js';
import '../../styles/cards.css';
import '../../styles/table.css';
import './Dashboard.css';

/* Icon lookup for quick actions (avoids wildcard import) */
const ACTION_ICONS = {
  Plus,
  BookOpen,
  Users,
  BarChart3,
};

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={12}
      fill={i < rating ? '#f59e0b' : 'transparent'}
      color={i < rating ? '#f59e0b' : 'var(--admin-text-muted)'}
    />
  ));
}

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-page-content">
      <SectionHeader
        title="Dashboard"
        subtitle="Welcome back, Dishant! Here's your platform overview."
      />

      {/* ── Stats Grid ── */}
      <div className="dashboard-stats-grid">
        {dashboardStats.map((stat, index) => (
          <StatCard key={stat.id} {...stat} index={index} />
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action) => {
            const IconComponent = ACTION_ICONS[action.icon] || Plus;
            return (
              <div
                key={action.id}
                className="quick-action-card"
                onClick={() => navigate(action.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(action.link)}
              >
                <div className="quick-action-icon" style={{ background: action.gradient }}>
                  <IconComponent size={18} />
                </div>
                <div className="quick-action-text">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Analytics Charts ── */}
      <div className="dashboard-charts-grid">
        <ChartCard
          title={studentGrowthData.title}
          subtitle={studentGrowthData.subtitle}
        >
          <BarChart
            data={studentGrowthData.data}
            labels={studentGrowthData.labels}
            color={studentGrowthData.color}
          />
        </ChartCard>

        <ChartCard
          title={coursePopularityData.title}
          subtitle={coursePopularityData.subtitle}
        >
          <DoughnutChart
            items={coursePopularityData.items}
            centerValue="100%"
            centerLabel="Total"
          />
        </ChartCard>

        <ChartCard
          title={enrollmentTrendData.title}
          subtitle={enrollmentTrendData.subtitle}
        >
          <AreaChart
            data={enrollmentTrendData.data}
            labels={enrollmentTrendData.labels}
            color={enrollmentTrendData.color}
          />
        </ChartCard>
      </div>

      {/* ── Recent Activity ── */}
      <div className="dashboard-recent-grid">
        {/* Recent Students */}
        <div className="admin-table-wrapper">
          <div className="table-toolbar">
            <h4 className="table-section-title">Recent Students</h4>
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => navigate('/admin/students')}
            >
              View All
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="table-user-cell">
                      <div className="table-user-avatar">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="table-user-info">
                        <span className="table-user-name">{s.name}</span>
                        <span className="table-user-email">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{s.course}</td>
                  <td className="dashboard-date-cell">
                    <Clock size={11} className="dashboard-clock-icon" />
                    {s.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Courses */}
        <div className="admin-table-wrapper">
          <div className="table-toolbar">
            <h4 className="table-section-title">Recent Courses</h4>
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => navigate('/admin/courses')}
            >
              View All
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="table-user-info">
                      <span className="table-user-name">{c.title}</span>
                      <span className="table-user-email">{c.category}</span>
                    </div>
                  </td>
                  <td>{c.students}</td>
                  <td><Badge variant={c.status} dot>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Reviews */}
        <div className="admin-table-wrapper">
          <div className="table-toolbar">
            <h4 className="table-section-title">Recent Reviews</h4>
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => navigate('/admin/reviews')}
            >
              View All
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Rating</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentReviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="table-user-info">
                      <span className="table-user-name">{r.student}</span>
                      <span className="table-user-email">{r.course}</span>
                    </div>
                  </td>
                  <td>
                    <div className="dashboard-stars">
                      {renderStars(r.rating)}
                    </div>
                  </td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Support */}
        <div className="admin-table-wrapper">
          <div className="table-toolbar">
            <h4 className="table-section-title">Pending Support</h4>
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => navigate('/admin/support')}
            >
              View All
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingSupport.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="table-user-info">
                      <span className="table-user-name">{t.subject}</span>
                      <span className="table-user-email">{t.student}</span>
                    </div>
                  </td>
                  <td><Badge variant={t.priority} dot>{t.priority}</Badge></td>
                  <td><Badge variant={t.status} dot>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
