import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../DashboardStyles.css';
import './DashboardCourses.css';

const FILTERS = ['All', 'In Progress', 'Completed', 'Not Started'];

function ProgressRing({ value, size = 52, stroke = 5 }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const color = value === 100 ? '#34d399' : value > 0 ? '#00f2fe' : 'rgba(255,255,255,0.1)';
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '0.6rem', fontWeight: 800, color: '#fff' }}>{value}%</span>
    </div>
  );
}

function DashboardCourses({ enrolledCourses, favoriteCourses, completedSyllabusItems, toggleFavorite, setActiveCourse }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const getCourseProgress = (course) => {
    if (!course?.syllabus?.length) return 0;
    const done = course.syllabus.reduce((a, _, i) =>
      a + (completedSyllabusItems[`${course.title}-${i}`] ? 1 : 0), 0);
    return Math.round((done / course.syllabus.length) * 100);
  };

  const filteredCourses = enrolledCourses
    .filter(c => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      const pct = getCourseProgress(c);
      if (filter === 'In Progress') return pct > 0 && pct < 100;
      if (filter === 'Completed') return pct === 100;
      if (filter === 'Not Started') return pct === 0;
      return true;
    });

  return (
    <div className="dash-section dash-courses">
      {/* Header */}
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: 'rgba(0,242,254,0.12)' }}>📚</span>
            My Courses
          </h2>
          <p className="dash-section-subtitle">{enrolledCourses.length} enrolled courses</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="courses-toolbar">
        <div className="courses-search-wrap">
          <span className="courses-search-icon">🔍</span>
          <input
            className="courses-search-input"
            type="text"
            placeholder="Search your courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="courses-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <div className="courses-filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`courses-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="courses-premium-grid">
          {filteredCourses.map((course, idx) => {
            const pct = getCourseProgress(course);
            const isFav = favoriteCourses.some(f => f.title === course.title);
            const done = course.syllabus?.reduce((a, _, i) =>
              a + (completedSyllabusItems[`${course.title}-${i}`] ? 1 : 0), 0) || 0;

            return (
              <div key={idx} className="course-premium-card" onClick={() => setActiveCourse(course)}>
                {/* Top Decoration */}
                <div className="course-card-top" style={{
                  background: pct === 100
                    ? 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(5,150,105,0.08))'
                    : pct > 0
                    ? 'linear-gradient(135deg, rgba(0,242,254,0.12), rgba(79,172,254,0.06))'
                    : 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(99,102,241,0.06))'
                }}>
                  <div className="course-emoji-big">{course.emoji}</div>
                  <ProgressRing value={pct} />
                  <button
                    className={`course-fav-btn ${isFav ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleFavorite(course.title, e); }}
                    aria-label="Toggle favorite"
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Info */}
                <div className="course-card-body">
                  <div className="course-card-badges">
                    <span className={`dash-badge ${pct === 100 ? 'green' : pct > 0 ? 'cyan' : 'purple'}`}>
                      {pct === 100 ? '✅ Completed' : pct > 0 ? '▶ In Progress' : '🔒 Not Started'}
                    </span>
                    <span className="dash-badge amber">{course.level}</span>
                  </div>

                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc">{course.description}</p>

                  <div className="course-card-meta">
                    <span>⏱ {course.duration}</span>
                    <span>🎬 {course.videos?.length || 0} videos</span>
                    <span>📋 {course.syllabus?.length || 0} lessons</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="course-card-progress">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                      <span>{done}/{course.syllabus?.length || 0} lessons</span>
                      <span style={{ color: pct === 100 ? '#34d399' : '#00f2fe' }}>{pct}%</span>
                    </div>
                    <div className="dash-progress-bar">
                      <div className="dash-progress-fill" style={{
                        width: `${pct}%`,
                        background: pct === 100
                          ? 'linear-gradient(90deg, #34d399, #059669)'
                          : 'linear-gradient(90deg, #00f2fe, #4facfe)'
                      }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="course-card-actions">
                    <button
                      className="dash-btn primary"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={e => { e.stopPropagation(); navigate(`/watch/${encodeURIComponent(course.title)}`); }}
                    >
                      {pct === 100 ? '🔁 Revisit' : pct > 0 ? '▶ Resume' : '▶ Start'}
                    </button>
                    <button
                      className="dash-btn ghost"
                      onClick={e => { e.stopPropagation(); setActiveCourse(course); }}
                      title="View details"
                    >
                      ℹ️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dash-empty">
          <div className="dash-empty-icon">📚</div>
          <h3>{search ? 'No courses match your search' : 'No courses in this category'}</h3>
          <p>{search ? `Try a different search term` : `Browse our catalog and enroll in a course to get started`}</p>
          {!search && (
            <button className="dash-btn primary" onClick={() => navigate('/courses')}>
              Browse Courses
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardCourses;
