import React from 'react';
import './Engagement.css';

function CareerRoadmapPreview() {
  return (
    <section className="roadmap-preview-section">
      <div className="section-header">
        <h2 className="section-title-gradient">Career Roadmaps</h2>
        <p className="section-subtitle-center">Clear paths from beginner to hired professional.</p>
      </div>
      <div className="roadmap-grid">
        <div className="roadmap-card hover-lift">
          <div className="roadmap-icon">💻</div>
          <h3>Frontend Engineer</h3>
          <p>HTML/CSS → JavaScript → React → Next.js → System Design</p>
          <div className="roadmap-meta">
            <span>⏳ 6 Months</span>
            <span>💰 $80k - $120k</span>
          </div>
          <div className="roadmap-progress">
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: '30%'}}></div></div>
            <span className="progress-label">30% Complete</span>
          </div>
        </div>
        <div className="roadmap-card hover-lift">
          <div className="roadmap-icon">⚙️</div>
          <h3>Backend Engineer</h3>
          <p>Node.js → Express → Databases → Caching → Microservices</p>
          <div className="roadmap-meta">
            <span>⏳ 8 Months</span>
            <span>💰 $90k - $140k</span>
          </div>
          <div className="roadmap-progress">
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: '0%'}}></div></div>
            <span className="progress-label">Not Started</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareerRoadmapPreview;
