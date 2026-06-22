import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../DashboardStyles.css';
import './DashboardHome.css';

/* ── Animated Counter Hook ── */
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Progress Ring ── */
function ProgressRing({ value, size = 56, stroke = 5, color = '#00f2fe', label }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <span style={{
        position: 'absolute',
        fontSize: size < 60 ? '0.65rem' : '0.8rem',
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1,
        textAlign: 'center'
      }}>{label || `${value}%`}</span>
    </div>
  );
}

/* ── Get greeting by hour ── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '⛅' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Good Night', emoji: '🌙' };
}

/* ── Mock activity data ── */
const recentActivity = [
  { icon: '📺', color: '#00f2fe', bg: 'rgba(0,242,254,0.12)', title: 'Watched "React JS - Hooks & Context API"', time: '2 hours ago' },
  { icon: '✅', color: '#34d399', bg: 'rgba(52,211,153,0.12)', title: 'Completed Lesson: CSS3 Flexbox & Grid', time: 'Yesterday' },
  { icon: '⭐', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', title: 'Earned 50 XP for daily streak', time: 'Yesterday' },
  { icon: '📚', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Started Course: Web Development', time: '3 days ago' },
  { icon: '🏆', color: '#f472b6', bg: 'rgba(244,114,182,0.12)', title: 'Achievement Unlocked: First Login', time: '5 days ago' },
];

const motivationalQuotes = [
  "Every expert was once a beginner. Keep going! 🚀",
  "The only way to learn is to build. Ship more! ⚡",
  "Progress, not perfection. You got this! 💪",
  "Small steps every day lead to massive results. 🌟",
  "Code, learn, grow. Repeat. 🔁",
];

function DashboardHome({ currentUser, enrolledCourses, favoriteCourses, completedSyllabusItems, setActiveSection }) {
  const navigate = useNavigate();
  const { text: greetText, emoji: greetEmoji } = getGreeting();

  // Compute real stats
  const totalEnrolled = enrolledCourses.length;
  const totalCompleted = enrolledCourses.filter(c => {
    if (!c.syllabus?.length) return false;
    const done = c.syllabus.reduce((acc, _, idx) =>
      acc + (completedSyllabusItems[`${c.title}-${idx}`] ? 1 : 0), 0);
    return done === c.syllabus.length && done > 0;
  }).length;

  const totalHours = enrolledCourses.reduce((acc, c) => {
    const months = parseInt(c.duration) || 0;
    return acc + months * 4; // Approx hours
  }, 0);

  const overallProgress = totalEnrolled > 0
    ? Math.round(enrolledCourses.reduce((acc, c) => {
        if (!c.syllabus?.length) return acc;
        const done = c.syllabus.reduce((a, _, i) =>
          a + (completedSyllabusItems[`${c.title}-${i}`] ? 1 : 0), 0);
        return acc + (done / c.syllabus.length) * 100;
      }, 0) / totalEnrolled)
    : 0;

  const streakDays = 15; // Mock
  const xpPoints = 1240;
  const quote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  // Animated counters
  const animEnrolled = useCounter(totalEnrolled);
  const animCompleted = useCounter(totalCompleted);
  const animHours = useCounter(totalHours);
  const animXP = useCounter(xpPoints);
  const animFav = useCounter(favoriteCourses.length);

  // Continue learning = first enrolled course with < 100% progress
  const continueCourse = enrolledCourses.find(c => {
    if (!c.syllabus?.length) return false;
    const done = c.syllabus.reduce((a, _, i) =>
      a + (completedSyllabusItems[`${c.title}-${i}`] ? 1 : 0), 0);
    return done < c.syllabus.length;
  }) || enrolledCourses[0];

  const getCourseProgress = (course) => {
    if (!course?.syllabus?.length) return 0;
    const done = course.syllabus.reduce((a, _, i) =>
      a + (completedSyllabusItems[`${course.title}-${i}`] ? 1 : 0), 0);
    return Math.round((done / course.syllabus.length) * 100);
  };

  const stats = [
    { icon: '📚', label: 'Enrolled', value: animEnrolled, color: 'cyan', trend: '+2 this month', up: true },
    { icon: '🎓', label: 'Completed', value: animCompleted, color: 'green', trend: 'Keep going!', up: true },
    { icon: '⏱️', label: 'Hours Learned', value: animHours, color: 'purple', trend: '+8 this week', up: true },
    { icon: '🔥', label: 'Day Streak', value: streakDays, color: 'amber', trend: 'Personal best!', up: true },
    { icon: '❤️', label: 'Saved Courses', value: animFav, color: 'pink', trend: 'Browse more', up: false },
    { icon: '⚡', label: 'XP Points', value: animXP.toLocaleString(), color: 'cyan', trend: '+50 today', up: true },
    { icon: '🏆', label: 'Achievements', value: 3, color: 'amber', trend: '5 locked', up: false },
  ];

  return (
    <div className="dash-section dash-home">
      {/* Hero / Greeting */}
      <div className="home-hero">
        <div className="home-hero-left">
          <div className="home-greeting-badge">
            <span className="home-greeting-emoji">{greetEmoji}</span>
            <span>{greetText}</span>
          </div>
          <h1 className="home-hero-title">
            Hello, <span className="home-name-gradient">{currentUser?.name?.split(' ')[0] || 'Student'}</span>!
          </h1>
          <p className="home-hero-subtitle">Continue where you left off and keep building your future.</p>
          <p className="home-quote">"{quote}"</p>

          <div className="home-hero-chips">
            <div className="home-chip fire">🔥 {streakDays} Day Streak</div>
            <div className="home-chip goal">🎯 Today's Goal: 2 Lessons</div>
            <div className="home-chip progress">📊 Weekly: {overallProgress}%</div>
          </div>
        </div>

        <div className="home-hero-right">
          <div className="home-progress-circle">
            <ProgressRing value={overallProgress} size={140} stroke={10} color="#00f2fe" label={`${overallProgress}%`} />
            <div className="home-progress-label">Overall<br />Progress</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dash-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`dash-stat-card ${s.color}`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={`dash-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="dash-stat-value">{s.value}</div>
            <div className="dash-stat-label">{s.label}</div>
            <div className={`dash-stat-trend ${s.up ? 'up' : 'down'}`}>
              {s.up ? '↑' : '→'} {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      {continueCourse && (
        <div className="home-continue-section">
          <div className="home-continue-header">
            <h3>▶ Continue Learning</h3>
            <button className="dash-btn ghost" onClick={() => setActiveSection('courses')}>View All</button>
          </div>
          <div className="home-continue-card">
            <div className="home-continue-emoji">{continueCourse.emoji}</div>
            <div className="home-continue-info">
              <div className="home-continue-course-name">{continueCourse.title}</div>
              <div className="home-continue-meta">
                <span className="dash-badge cyan">In Progress</span>
                <span className="home-continue-duration">⏱ {continueCourse.duration}</span>
                <span className="home-continue-level">📶 {continueCourse.level}</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                  <span>Progress</span>
                  <span>{getCourseProgress(continueCourse)}%</span>
                </div>
                <div className="dash-progress-bar">
                  <div className="dash-progress-fill" style={{ width: `${getCourseProgress(continueCourse)}%` }} />
                </div>
              </div>
            </div>
            <button
              className="dash-btn primary home-continue-btn"
              onClick={() => navigate(`/watch/${encodeURIComponent(continueCourse.title)}`)}
            >
              ▶ Resume
            </button>
          </div>
        </div>
      )}

      {/* Weekly Goal */}
      <div className="home-two-col">
        <div className="dash-glass-card home-weekly-goal">
          <h3 className="home-widget-title">📅 Weekly Goal</h3>
          <div className="home-goal-items">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="home-goal-day">
                <div className={`home-goal-bar-wrap`}>
                  <div
                    className="home-goal-bar"
                    style={{
                      height: `${[60, 80, 45, 90, 70, 30, 55][i]}%`,
                      background: i < 4 ? 'linear-gradient(180deg,#00f2fe,#4facfe)' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
                <span className={`home-goal-day-label ${i < 4 ? 'active' : ''}`}>{day}</span>
              </div>
            ))}
          </div>
          <div className="home-goal-footer">
            <span>🎯 Goal: 30 min/day</span>
            <span className="home-goal-pct" style={{ color: '#34d399' }}>78% achieved</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dash-glass-card home-activity">
          <h3 className="home-widget-title">🕐 Recent Activity</h3>
          <div className="dash-timeline">
            {recentActivity.map((item, i) => (
              <div key={i} className="dash-timeline-item">
                <div className="dash-timeline-line">
                  <div className="dash-timeline-dot" style={{ background: item.bg, color: item.color }}>
                    {item.icon}
                  </div>
                  {i < recentActivity.length - 1 && <div className="dash-timeline-connector" />}
                </div>
                <div className="dash-timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
