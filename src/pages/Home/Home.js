import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  // Feature data used in the home page. This structure makes it easy for an Admin to update later via API.
  const featuresData = [
    {
      id: "instructors",
      icon: "👨‍🏫",
      title: "Expert Instructors",
      shortDesc: "Learn directly from industry professionals with years of real-world experience.",
      detailedInfo: "Our instructors are vetted professionals with over 10+ years of experience in top tech companies.",
      contentType: "instructors",
      contentList: [
        { name: "John Doe", role: "Senior Frontend Engineer", experience: "10 Years at Google", avatar: "👨‍💻" },
        { name: "Jane Smith", role: "Lead Data Scientist", experience: "8 Years at Amazon", avatar: "👩‍🔬" },
      ]
    },
    {
      id: "projects",
      icon: "💻",
      title: "Hands-on Projects",
      shortDesc: "Build a stunning portfolio with real-world projects and practical assignments.",
      detailedInfo: "Stop watching and start building. Here are some of the projects you will build to prove your skills:",
      contentType: "projects",
      contentList: [
        { name: "E-Commerce Platform", desc: "Build a fully functional store with Stripe integration.", tech: "React, Node, MongoDB", icon: "🛒" },
        { name: "AI Chat Application", desc: "Create a real-time chat app using OpenAI APIs.", tech: "Python, WebSockets", icon: "🤖" }
      ]
    },
    {
      id: "certificates",
      icon: "🏆",
      title: "Certification",
      shortDesc: "Earn industry-recognized certificates upon completion to boost your resume.",
      detailedInfo: "Earn certificates that prove your skills to employers globally.",
      contentType: "certificates",
      contentList: [
        { name: "Full-Stack Web Development", issuer: "Solution Adda & Partners", image: "📜", highlight: "Industry Recognized" },
        { name: "Data Science Bootcamp", issuer: "Solution Adda & Partners", image: "🎓", highlight: "Verified Credential" }
      ]
    },
    {
      id: "community",
      icon: "🤝",
      title: "Community Support",
      shortDesc: "Join a thriving community of learners and mentors ready to help you succeed.",
      detailedInfo: "Get 24/7 access to our private Discord server. Participate in weekly hackathons, study groups, and get instant debugging help from peers and alumni who have already landed top jobs.",
      contentType: "text",
      contentList: []
    }
  ];

  const [selectedFeature, setSelectedFeature] = useState(null);

  const openModal = (feature) => setSelectedFeature(feature);
  const closeModal = () => setSelectedFeature(null);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">New: AI & Machine Learning Courses! 🚀</div>
          <h1 className="hero-title">Unlock Your Future in <span className="highlight">Tech</span></h1>
          <p className="hero-subtitle">
            Master the most in-demand skills with our comprehensive, expert-led courses in Web Development, AI, Cloud Computing, and more.
          </p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn-primary">Explore Courses</Link>
            <a href="#features" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          {/* Abstract geometric shapes representing tech education */}
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
          <div className="glass-card">
            <h3>Learn by Doing</h3>
            <p>100+ Hands-on Projects</p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          {featuresData.map((feature) => (
            <div 
              className="feature-card clickable" 
              key={feature.id}
              onClick={() => openModal(feature)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.shortDesc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <div className="home-modal-overlay" onClick={closeModal}>
          <div className="home-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="home-close-btn" onClick={closeModal}>✕</button>
            <div className="home-modal-header">
              <div className="feature-icon modal-icon">{selectedFeature.icon}</div>
              <h2 className="home-modal-title">{selectedFeature.title}</h2>
            </div>
            <div className="home-modal-body">
              <p className="modal-description">{selectedFeature.detailedInfo}</p>
              
              {selectedFeature.contentType === 'instructors' && (
                <div className="modal-list-grid">
                  {selectedFeature.contentList.map((item, idx) => (
                    <div key={idx} className="modal-list-item">
                      <div className="item-avatar">{item.avatar}</div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-role">{item.role}</p>
                        <span className="item-meta">{item.experience}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFeature.contentType === 'projects' && (
                <div className="modal-list-grid">
                  {selectedFeature.contentList.map((item, idx) => (
                    <div key={idx} className="modal-list-item">
                      <div className="item-avatar">{item.icon}</div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-desc">{item.desc}</p>
                        <span className="item-meta">Tech: {item.tech}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFeature.contentType === 'certificates' && (
                <div className="modal-list-grid">
                  {selectedFeature.contentList.map((item, idx) => (
                    <div key={idx} className="modal-list-item certificate-item">
                      <div className="item-avatar cert-icon">{item.image}</div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-role">Issuer: {item.issuer}</p>
                        <span className="item-meta cert-highlight">{item.highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
            <div className="home-modal-footer">
               <button className="btn-primary" onClick={closeModal}>Got it!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
