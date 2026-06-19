import React from 'react';
import './Engagement.css';

function InstructorSpotlight() {
  return (
    <section className="instructor-spotlight-section">
      <div className="section-header">
        <h2 className="section-title-gradient">Learn from the Best</h2>
        <p className="section-subtitle-center">Our instructors are industry veterans from top tech companies.</p>
      </div>
      <div className="instructor-grid">
        <div className="instructor-card hover-lift">
          <div className="instructor-avatar">👨‍💻</div>
          <div className="instructor-info">
            <h3>Alex Ramirez</h3>
            <p className="instructor-title">Ex-Google Senior Engineer</p>
            <p className="instructor-bio">Teaches Advanced React & System Design.</p>
            <div className="instructor-stats">
              <span>⭐ 4.9</span>
              <span>👥 20k Students</span>
            </div>
          </div>
        </div>
        <div className="instructor-card hover-lift">
          <div className="instructor-avatar">👩‍🔬</div>
          <div className="instructor-info">
            <h3>Dr. Emily Chen</h3>
            <p className="instructor-title">AI Researcher at OpenAI</p>
            <p className="instructor-bio">Teaches Machine Learning & Python.</p>
            <div className="instructor-stats">
              <span>⭐ 4.95</span>
              <span>👥 15k Students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstructorSpotlight;
