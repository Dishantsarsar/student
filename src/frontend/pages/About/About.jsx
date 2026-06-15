import React from 'react';
import './About.css';

// Custom JSX SVG Icon Components
const CourseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "#00f2fe" }}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "#4facfe" }}>
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "#fc00ff" }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "#00f2fe" }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

function About() {
  return (
    <div className="about-page-container">
      {/* Background elements aligned with Home Page */}
      <div className="hero-grid-overlay" />
      <div className="abstract-shape shape-1" style={{ top: '15%', left: '5%' }} />
      <div className="abstract-shape shape-2" style={{ bottom: '20%', right: '5%' }} />

      {/* Hero Header */}
      <header className="about-hero">
        <span className="about-badge">E-Learning Central 🚀</span>
        <h1 className="about-title">
          About <span className="highlight">Solution Adda</span>
        </h1>
        <p className="about-subtitle">
          A centralized, full-stack learning platform designed to streamline student education, track progress, and organize dynamic course catalogs.
        </p>
      </header>

      {/* Core Concept Section */}
      <section className="about-section">
        <div className="about-glass-card concept-card-glow">
          <h2>The Problem We Are Solving</h2>
          <p>
            In traditional online systems, learning checkpoints, assignments, and course updates are scattered across different platforms and chat channels. 
            <strong> Solution Adda</strong> solves this friction by combining modern course discovery, dynamic progress tracking checklists, and direct educator controls into a single elegant portal. Students can manage their own learning pace while teachers publish and modify courses instantly.
          </p>
        </div>
      </section>

      {/* Clean Feature Blocks */}
      <section className="about-section">
        <h2 className="section-title-center">Core Pillars of Solution Adda</h2>
        <div className="features-grid">
          
          <div className="about-glass-card feature-hover-glow">
            <div className="feature-icon-wrapper">
              <CourseIcon />
            </div>
            <h3>Course Management</h3>
            <p>Easy discovery and cataloging of technical skills and academic subjects in one interactive workspace.</p>
          </div>

          <div className="about-glass-card feature-hover-glow">
            <div className="feature-icon-wrapper">
              <VideoIcon />
            </div>
            <h3>Syllabus Checklist</h3>
            <p>Interactive trackers that persist progress dynamically so you always pick up right where you left off.</p>
          </div>

          <div className="about-glass-card feature-hover-glow">
            <div className="feature-icon-wrapper">
              <AnalyticsIcon />
            </div>
            <h3>Dynamic Analytics</h3>
            <p>Real-time updates of student milestones based on unique courses enrolled and syllabus steps completed.</p>
          </div>

        </div>
      </section>

      {/* Future Targets Note */}
      <section className="about-section" style={{ marginBottom: "60px" }}>
        <div className="about-glass-card future-note-card">
          <div className="future-header">
            <TargetIcon />
            <h3>What's Next?</h3>
          </div>
          <p>
            We are actively developing automated course recommendations, personal mentor feedback integration, and peer-to-peer discussion panels to build an even stronger collaborative learning space.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;