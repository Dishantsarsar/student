import React, { useState } from 'react';
import '../DashboardStyles.css';
import './DashboardAchievements.css';

const achievements = [
  { id: 1, icon: '🏅', title: 'First Course', desc: 'Enrolled in your first course', xp: 100, earned: true, color: '#fbbf24', date: 'Jun 18, 2026' },
  { id: 2, icon: '🔥', title: '7-Day Streak', desc: 'Learned 7 days in a row', xp: 200, earned: true, color: '#f87171', date: 'Jun 20, 2026' },
  { id: 3, icon: '⭐', title: 'First Login', desc: 'Joined Solution Adda', xp: 50, earned: true, color: '#a78bfa', date: 'Jun 15, 2026' },
  { id: 4, icon: '🎓', title: 'First Certificate', desc: 'Complete any course 100%', xp: 500, earned: false, color: '#34d399' },
  { id: 5, icon: '🚀', title: 'Project Master', desc: 'Submit 3 projects', xp: 300, earned: false, color: '#00f2fe' },
  { id: 6, icon: '💪', title: '30-Day Streak', desc: 'Learn for 30 consecutive days', xp: 1000, earned: false, color: '#f472b6' },
  { id: 7, icon: '📚', title: 'Book Worm', desc: 'Complete 5 courses', xp: 750, earned: false, color: '#fbbf24' },
  { id: 8, icon: '⚡', title: 'Speed Learner', desc: 'Complete a lesson in under 10 mins', xp: 150, earned: false, color: '#fb923c' },
  { id: 9, icon: '🏆', title: 'Top Performer', desc: 'Reach the top 10 leaderboard', xp: 2000, earned: false, color: '#00f2fe' },
];

function DashboardAchievements() {
  const [filter, setFilter] = useState('all');
  const earned = achievements.filter(a => a.earned);
  const totalXP = earned.reduce((a, b) => a + b.xp, 0);
  const nextLevelXP = 2000;
  const xpPct = Math.round((totalXP / nextLevelXP) * 100);

  const filtered = achievements.filter(a => {
    if (filter === 'earned') return a.earned;
    if (filter === 'locked') return !a.earned;
    return true;
  });

  return (
    <div className="dash-section dash-achievements">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>🏆</span>
            Achievements
          </h2>
          <p className="dash-section-subtitle">{earned.length} of {achievements.length} unlocked</p>
        </div>
      </div>

      {/* XP Level Card */}
      <div className="achievements-level-card dash-glass-card">
        <div className="level-card-left">
          <div className="level-badge">
            <span className="level-num">7</span>
            <span className="level-label">LVL</span>
          </div>
          <div>
            <div className="level-title">Learning Champion</div>
            <div className="level-sub">Next Level: Scholar at 2,000 XP</div>
          </div>
        </div>
        <div className="level-card-right">
          <div className="level-xp-info">
            <span className="level-xp-val">⚡ {totalXP.toLocaleString()} XP</span>
            <span className="level-xp-next">/ {nextLevelXP.toLocaleString()}</span>
          </div>
          <div className="dash-progress-bar" style={{ width: '240px' }}>
            <div className="dash-progress-fill" style={{
              width: `${xpPct}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)'
            }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {nextLevelXP - totalXP} XP to next level
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="achievements-filters">
        {['all', 'earned', 'locked'].map(f => (
          <button
            key={f}
            className={`courses-filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${achievements.length})` : f === 'earned' ? `✅ Earned (${earned.length})` : `🔒 Locked (${achievements.length - earned.length})`}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="achievements-grid">
        {filtered.map((ach) => (
          <div key={ach.id} className={`achievement-card ${ach.earned ? 'earned' : 'locked'}`}>
            {!ach.earned && <div className="achievement-lock-overlay"><span>🔒</span></div>}
            <div className="achievement-icon-wrap" style={{
              background: ach.earned ? `${ach.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${ach.earned ? `${ach.color}35` : 'rgba(255,255,255,0.08)'}`
            }}>
              <span className={`achievement-icon ${!ach.earned ? 'blurred' : ''}`}>{ach.icon}</span>
            </div>
            <div className="achievement-info">
              <div className="achievement-title" style={{ color: ach.earned ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                {ach.title}
              </div>
              <div className="achievement-desc">{ach.desc}</div>
              {ach.earned && <div className="achievement-date">{ach.date}</div>}
            </div>
            <div className="achievement-xp" style={{ color: ach.earned ? ach.color : 'rgba(255,255,255,0.2)' }}>
              +{ach.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardAchievements;
