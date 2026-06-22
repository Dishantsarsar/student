import React, { useState } from 'react';
import '../DashboardStyles.css';
import './DashboardAnalytics.css';

const weeklyData = [
  { day: 'Mon', hours: 1.5, lessons: 3 },
  { day: 'Tue', hours: 2.0, lessons: 4 },
  { day: 'Wed', hours: 0.5, lessons: 1 },
  { day: 'Thu', hours: 2.5, lessons: 5 },
  { day: 'Fri', hours: 1.8, lessons: 3 },
  { day: 'Sat', hours: 0.8, lessons: 2 },
  { day: 'Sun', hours: 1.2, lessons: 2 },
];

const monthlyActivity = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  activity: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
}));

const skills = [
  { name: 'Web Dev', level: 72, color: '#00f2fe' },
  { name: 'Data Science', level: 45, color: '#a78bfa' },
  { name: 'Machine Learning', level: 28, color: '#f472b6' },
  { name: 'Cyber Security', level: 55, color: '#34d399' },
  { name: 'Cloud', level: 18, color: '#fbbf24' },
  { name: 'DevOps', level: 30, color: '#fb923c' },
];

const activityColors = ['transparent', 'rgba(0,242,254,0.2)', 'rgba(0,242,254,0.4)', 'rgba(0,242,254,0.65)', 'rgba(0,242,254,0.9)'];

function DashboardAnalytics({ enrolledCourses, completedSyllabusItems }) {
  const [activeTab, setActiveTab] = useState('weekly');

  const totalHours = weeklyData.reduce((a, d) => a + d.hours, 0).toFixed(1);
  const avgHours = (totalHours / 7).toFixed(1);
  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const getCourseProgress = (course) => {
    if (!course?.syllabus?.length) return 0;
    const done = course.syllabus.reduce((a, _, i) =>
      a + (completedSyllabusItems[`${course.title}-${i}`] ? 1 : 0), 0);
    return Math.round((done / course.syllabus.length) * 100);
  };

  return (
    <div className="dash-section dash-analytics">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: 'rgba(167,139,250,0.12)' }}>📈</span>
            Learning Analytics
          </h2>
          <p className="dash-section-subtitle">Track your learning patterns and progress</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary-row">
        {[
          { icon: '⏱️', label: 'This Week', value: `${totalHours}h`, sub: 'total hours', color: 'cyan' },
          { icon: '📊', label: 'Daily Avg', value: `${avgHours}h`, sub: 'per day', color: 'purple' },
          { icon: '🔥', label: 'Streak', value: '15 days', sub: 'current', color: 'amber' },
          { icon: '⚡', label: 'XP Earned', value: '1,240', sub: 'this month', color: 'green' },
        ].map((item, i) => (
          <div key={i} className={`analytics-summary-card dash-stat-card ${item.color}`}>
            <div className={`dash-stat-icon ${item.color}`}>{item.icon}</div>
            <div className="dash-stat-value">{item.value}</div>
            <div className="dash-stat-label">{item.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="analytics-main-grid">
        {/* Bar Chart */}
        <div className="dash-glass-card analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">📊 Weekly Learning Hours</h3>
            <div className="analytics-tabs">
              {['weekly', 'monthly'].map(t => (
                <button key={t} className={`analytics-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="analytics-bar-chart">
            {weeklyData.map((d, i) => (
              <div key={i} className="analytics-bar-group">
                <div className="analytics-bar-label-top">
                  {d.hours > 0 && <span>{d.hours}h</span>}
                </div>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill"
                    style={{ height: `${(d.hours / maxHours) * 100}%` }}
                  />
                </div>
                <div className="analytics-bar-day">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Bars */}
        <div className="dash-glass-card analytics-skills-card">
          <h3 className="analytics-chart-title">🎯 Skill Progress</h3>
          <div className="analytics-skills-list">
            {skills.map((skill, i) => (
              <div key={i} className="analytics-skill-item">
                <div className="analytics-skill-header">
                  <span className="analytics-skill-name">{skill.name}</span>
                  <span className="analytics-skill-pct" style={{ color: skill.color }}>{skill.level}%</span>
                </div>
                <div className="dash-progress-bar">
                  <div
                    className="dash-progress-fill"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Progress Table */}
      <div className="dash-glass-card">
        <h3 className="analytics-chart-title" style={{ marginBottom: 20 }}>📚 Course Completion Overview</h3>
        {enrolledCourses.length > 0 ? (
          <div className="analytics-course-table">
            {enrolledCourses.map((course, i) => {
              const pct = getCourseProgress(course);
              return (
                <div key={i} className="analytics-course-row">
                  <div className="analytics-course-emoji">{course.emoji}</div>
                  <div className="analytics-course-info">
                    <div className="analytics-course-name">{course.title}</div>
                    <div className="analytics-course-meta">{course.duration} · {course.level}</div>
                  </div>
                  <div className="analytics-course-progress-wrap">
                    <div className="dash-progress-bar" style={{ width: 160 }}>
                      <div
                        className="dash-progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? 'linear-gradient(90deg,#34d399,#059669)' : 'linear-gradient(90deg,#00f2fe,#4facfe)'
                        }}
                      />
                    </div>
                    <span className={`analytics-pct-badge ${pct === 100 ? 'complete' : ''}`}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="dash-empty">
            <div className="dash-empty-icon">📊</div>
            <h3>No data yet</h3>
            <p>Enroll in courses to see your analytics</p>
          </div>
        )}
      </div>

      {/* Activity Heatmap */}
      <div className="dash-glass-card">
        <h3 className="analytics-chart-title" style={{ marginBottom: 16 }}>🗓️ Activity Heatmap — June 2026</h3>
        <div className="analytics-heatmap">
          {monthlyActivity.map((d, i) => (
            <div
              key={i}
              className="heatmap-cell"
              style={{ background: activityColors[d.activity] }}
              title={`Day ${d.day}: ${d.activity} sessions`}
            >
              <span className="heatmap-day-num">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          {activityColors.map((c, i) => (
            <div key={i} className="heatmap-legend-cell" style={{ background: c || 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
