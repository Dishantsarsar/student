import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <header className="about-hero">
        <div className="badge">About Solution Adda</div>
        <h1 className="about-title">Empowering the <span className="highlight-blue">Next Generation</span> of Innovators</h1>
        <p className="about-subtitle">
          We believe that quality education should be accessible, engaging, and designed for the future. Solution Adda is here to bridge the gap between ambition and success.
        </p>
      </header>

      {/* Why We Built This */}
      <section className="about-section">
        <div className="two-column-layout">
          <div className="content-side">
            <h2 className="section-heading">Why Was Solution Adda Created?</h2>
            <p className="section-text">
              Traditional learning often struggles to keep up with the fast-paced evolution of technology. We noticed a recurring core challenge: <strong>dispersed learning materials and a lack of structured progress tracking were hindering academic growth.</strong>
            </p>
            <p className="section-text">
              Solution Adda was built to solve this. We wanted to create a centralized, distraction-free digital environment where students could seamlessly discover courses, engage with high-quality video content, and visually track their learning milestones all in one place.
            </p>
            <p className="section-text">
              By bridging the gap between traditional education systems and modern digital accessibility, we provide a structured path for anyone wanting to master in-demand tech skills.
            </p>
          </div>
          <div className="image-side">
            <div className="abstract-graphic">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="floating-card">
                <h3>Our Mission</h3>
                <p>To democratize tech education globally.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Knowledge & Core Values */}
      <section className="about-section dark-bg">
        <h2 className="section-heading center-text">What We Stand For</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Digital Accessibility</h3>
            <p>Education shouldn't have borders. Our platform is designed to be accessible from anywhere, bringing expert knowledge directly to your screen.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>Learn by Doing</h3>
            <p>Theory is only the beginning. We focus on hands-on projects, real-world applications, and structured learning paths.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Community Driven</h3>
            <p>Learning is better together. We foster an environment of peer-to-peer engagement and mentorship to keep you motivated.</p>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="about-section center-align footer-callout">
        <div className="enhancement-icon">🚀</div>
        <h2 className="section-heading">Looking to the Future</h2>
        <p className="section-text">
          We are constantly evolving. Our future roadmap includes AI-driven course recommendations tailored to your unique learning style and real-time peer messaging to ensure no student ever feels stuck.
        </p>
        <button className="join-btn">Join Our Journey</button>
      </section>
    </div>
  );
}

export default About;
