import React from 'react';
import './Engagement.css';

const lockedAchievements = [
  { id: 1, title: "First Course Completed", icon: "🔒", desc: "Finish your first course to unlock." },
  { id: 2, title: "7-Day Learning Streak", icon: "🔒", desc: "Learn for 7 consecutive days." },
  { id: 3, title: "Project Master", icon: "🔒", desc: "Complete 5 hands-on projects." },
  { id: 4, title: "First Certificate", icon: "🔒", desc: "Earn your first verified certificate." }
];

function LockedAchievements({ onAchievementClick }) {
  return (
    <div className="locked-achievements-widget">
      <h3 className="achievements-title">🏆 Your Achievements</h3>
      <div className="achievements-list">
        {lockedAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className="achievement-card hover-lift"
            onClick={onAchievementClick}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <h4>{achievement.title}</h4>
              <p>{achievement.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LockedAchievements;
