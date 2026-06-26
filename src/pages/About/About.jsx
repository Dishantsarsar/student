import React from 'react';
import SectionReveal, { RevealItem } from '../../components/ui/SectionReveal';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import './About.css';

function About() {
  return (
    <div className="student-about-dark">
      <AnimatedBackground variant="subtle" />
      
      {/* Premium Dark Hero Header */}
      <header className="dark-hero">
        <SectionReveal direction="down">
          <span className="project-tag">E-Learning Platform</span>
          <h1 className="hero-main-title">About <span className="text-gradient">Solution Adda</span></h1>
          <p className="hero-subtitle">
            A centralized full-stack learning platform designed to streamline student education and course management.
          </p>
        </SectionReveal>
      </header>

      {/* Core Concept Section */}
      <section className="dark-content-section">
        <SectionReveal direction="up" delay={0.2}>
          <div className="concept-card">
            <h2>The Problem We Are Solving</h2>
            <p>
              In traditional learning, study materials, video links, and assignments are often scattered across different groups and websites. 
              <strong> Solution Adda</strong> solves this challenge by bringing everything into one unified dashboard. 
              Students can explore courses, watch video lessons, and monitor their completion metrics seamlessly.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* Clean Feature Blocks (No Complex Grid/Table) */}
      <section className="dark-content-section">
        <SectionReveal direction="fade">
          <h2 className="section-title-center">Core Pillars of Solution Adda</h2>
        </SectionReveal>
        
        <SectionReveal stagger={true} className="modern-features-container">
          <RevealItem>
            <div className="modern-feature-box">
              <div className="feature-icon">🔍</div>
              <h3>Course Management</h3>
              <p>Easy discovery and structural organization of academic subjects and technical skills in one place.</p>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="modern-feature-box">
              <div className="feature-icon">📺</div>
              <h3>Video Tracking</h3>
              <p>Seamless learning experience with background persistence to save your exact watched time.</p>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="modern-feature-box">
              <div className="feature-icon">📊</div>
              <h3>Dynamic Analytics</h3>
              <p>Real-time calculation of student milestones based on unique lessons completed.</p>
            </div>
          </RevealItem>
        </SectionReveal>
      </section>

      {/* Simple Future Target */}
      <footer className="dark-future-note">
        <SectionReveal direction="up">
          <h3>What's Next?</h3>
          <p>
            We are currently working on adding automated course recommendations and integrated 
            discussion panels to make peer learning easier.
          </p>
        </SectionReveal>
      </footer>
    </div>
  );
}

export default About;