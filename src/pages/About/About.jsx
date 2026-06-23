import React from 'react';
import './About.css';

function About() {
  return (
    <div className="student-about-dark">
      {/* Premium Dark Hero Header */}
      <header className="dark-hero">
        <span className="project-tag">E-Learning Platform</span>
        <h1 className="hero-main-title">About <span className="text-gradient">Student Adda</span></h1>
        <p className="hero-subtitle">
          A centralized full-stack learning platform designed to streamline student education and course management.
        </p>
      </header>

      {/* Core Concept Section */}
      <section className="dark-content-section">
        <div className="concept-card">
          <h2>The Problem We Are Solving</h2>
          <p>
            In traditional learning, study materials, video links, and assignments are often scattered across different groups and websites. 
            <strong> Student Adda</strong> solves this challenge by bringing everything into one unified dashboard. 
            Students can explore courses, watch video lessons, and monitor their completion metrics seamlessly.
          </p>
        </div>
      </section>

      {/* Clean Feature Blocks (No Complex Grid/Table) */}
      <section className="dark-content-section">
        <h2 className="section-title-center">Core Pillars of Student Adda</h2>
        <div className="modern-features-container">
          
          <div className="modern-feature-box">
            <div className="feature-icon">🔍</div>
            <h3>Course Management</h3>
            <p>Easy discovery and structural organization of academic subjects and technical skills in one place.</p>
          </div>

          <div className="modern-feature-box">
            <div className="feature-icon">📺</div>
            <h3>Video Tracking</h3>
            <p>Seamless learning experience with background persistence to save your exact watched time.</p>
          </div>

          <div className="modern-feature-box">
            <div className="feature-icon">📊</div>
            <h3>Dynamic Analytics</h3>
            <p>Real-time calculation of student milestones based on unique lessons completed.</p>
          </div>

        </div>
      </section>

      {/* Simple Future Target */}
      <footer className="dark-future-note">
        <h3>What's Next?</h3>
        <p>
          We are currently working on adding automated course recommendations and integrated 
          discussion panels to make peer learning easier.
        </p>
      </footer>
    </div>
  );
}

export default About;