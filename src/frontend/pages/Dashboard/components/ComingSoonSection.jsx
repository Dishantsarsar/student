import React from 'react';
import '../DashboardStyles.css';
import './ComingSoonSection.css';

const sectionMeta = {
  assignments: {
    icon: '📝', title: 'Assignments', color: '#a78bfa',
    desc: 'Track upcoming and past assignments, submission status, and due dates.',
    features: ['Upcoming deadlines', 'Progress tracking', 'Submission history', 'Priority labels', 'Grade tracking'],
  },
  projects: {
    icon: '📂', title: 'Projects', color: '#00f2fe',
    desc: 'Manage your course projects, get mentor feedback, and track revisions.',
    features: ['Project portfolio', 'File uploads', 'Mentor feedback', 'Revision history', 'Completion tracking'],
  },
  calendar: {
    icon: '📅', title: 'Calendar', color: '#34d399',
    desc: 'View upcoming classes, deadlines, live sessions, and events in one place.',
    features: ['Live session alerts', 'Deadline reminders', 'Event scheduling', 'Google Calendar sync', 'Study planner'],
  },
  community: {
    icon: '💬', title: 'Community', color: '#f472b6',
    desc: 'Join study groups, participate in discussions, and top the leaderboard.',
    features: ['Study groups', 'Q&A forums', 'Leaderboard', 'Weekly challenges', 'Peer connections'],
  },
  career: {
    icon: '🚀', title: 'Career Center', color: '#fbbf24',
    desc: 'Build your resume, prep for interviews, and track placement opportunities.',
    features: ['Resume builder', 'Portfolio builder', 'Interview prep', 'Job listings', 'Mock tests'],
  },
};

function ComingSoonSection({ section }) {
  const meta = sectionMeta[section] || {
    icon: '🔮', title: section, color: '#00f2fe',
    desc: 'This section is coming soon!', features: [],
  };

  return (
    <div className="dash-section coming-soon-section">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: `${meta.color}18` }}>{meta.icon}</span>
            {meta.title}
          </h2>
          <p className="dash-section-subtitle">{meta.desc}</p>
        </div>
        <span className="coming-soon-badge">⏳ Coming Soon</span>
      </div>

      <div className="cs-main-card dash-glass-card">
        <div className="cs-illustration">
          <div className="cs-big-icon">{meta.icon}</div>
          <div className="cs-glow" style={{ background: `radial-gradient(circle, ${meta.color}30, transparent 70%)` }} />
        </div>

        <h3 className="cs-title">{meta.title} — Coming Soon</h3>
        <p className="cs-desc">
          We're building something amazing. This section will be live very soon.
        </p>

        <div className="cs-features-grid">
          {meta.features.map((f, i) => (
            <div key={i} className="cs-feature-chip" style={{ borderColor: `${meta.color}25`, color: meta.color }}>
              <span className="cs-feature-dot" style={{ background: meta.color }} />
              {f}
            </div>
          ))}
        </div>

        <div className="cs-progress-bar-wrap">
          <div className="cs-progress-bar-label">
            <span>Development Progress</span>
            <span style={{ color: meta.color }}>65%</span>
          </div>
          <div className="dash-progress-bar">
            <div className="dash-progress-fill" style={{
              width: '65%',
              background: `linear-gradient(90deg, ${meta.color}, ${meta.color}aa)`
            }} />
          </div>
        </div>

        <div className="cs-notify-row">
          <input className="cs-notify-input" type="email" placeholder="Get notified when it's ready..." readOnly />
          <button className="dash-btn primary" style={{ pointerEvents: 'none', opacity: 0.7 }}>
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonSection;
