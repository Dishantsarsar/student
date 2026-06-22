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
  const [selectedSubItem, setSelectedSubItem] = useState(null);

  const openModal = (feature) => {
    setSelectedFeature(feature);
    setSelectedSubItem(null);
  };
  const closeModal = () => {
    setSelectedFeature(null);
    setSelectedSubItem(null);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        {/* Futuristic background grid pattern */}
        <div className="hero-grid-overlay"></div>

        {/* Left-side decorative background glowing shapes */}
        <div className="abstract-shape left-shape-1"></div>
        <div className="abstract-shape left-shape-2"></div>

        {/* Floating background tech chips */}
        <div className="floating-tech-chip chip-1">⚛️ React</div>
        <div className="floating-tech-chip chip-2">🐍 Python</div>
        <div className="floating-tech-chip chip-3">🤖 AI / ML</div>
        <div className="floating-tech-chip chip-4">☁️ Cloud</div>

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

          {/* Core metrics panel underneath buttons */}
          <div className="hero-stats">
            <div className="stat-pill">
              <span className="pill-number">50k+</span>
              <span className="pill-text">Active Learners</span>
            </div>
            <div className="stat-pill">
              <span className="pill-number">4.8★</span>
              <span className="pill-text">Course Rating</span>
            </div>
            <div className="stat-pill">
              <span className="pill-number">95%</span>
              <span className="pill-text">Success Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          {/* Abstract geometric shapes representing tech education */}
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
          
          {/* Main Card */}
          <div className="glass-card">
            <h3>Learn by Doing</h3>
            <p>100+ Hands-on Projects</p>
          </div>

          {/* Secondary Floating badges to fill left/right visual space */}
          <div className="mini-glass-card floating-card-1">
            <span className="mini-icon">👨‍🏫</span>
            <div className="mini-details">
              <h4>Expert Mentors</h4>
              <p>Top Tech Engineers</p>
            </div>
          </div>
          
          <div className="mini-glass-card floating-card-2">
            <span className="mini-icon">🏆</span>
            <div className="mini-details">
              <h4>Industry Certs</h4>
              <p>Verified Credentials</p>
            </div>
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
            {selectedSubItem ? (
              <>
                <button className="home-close-btn" onClick={() => setSelectedSubItem(null)}>✕</button>
                <div className="home-modal-body" style={{ marginTop: '20px' }}>
                  <div className="modal-list-item" style={{ cursor: 'default', background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="item-avatar" style={{ width: '80px', height: '80px', fontSize: '3rem', flexShrink: 0 }}>
                      {selectedSubItem.icon || selectedSubItem.avatar || selectedSubItem.image}
                    </div>
                    <div className="item-details" style={{ textAlign: 'left' }}>
                      <h3 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 8px 0', fontWeight: '800' }}>
                        {selectedSubItem.name}
                      </h3>
                      <p className="item-desc" style={{ fontSize: '1.05rem', color: '#b0aec6', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                        {selectedSubItem.desc || selectedSubItem.role || (selectedSubItem.issuer ? `Issuer: ${selectedSubItem.issuer}` : '')}
                      </p>
                      {selectedSubItem.tech && <span className="item-meta">Tech: {selectedSubItem.tech}</span>}
                      {selectedSubItem.experience && <span className="item-meta">{selectedSubItem.experience}</span>}
                      {selectedSubItem.highlight && <span className="item-meta cert-highlight">{selectedSubItem.highlight}</span>}
                    </div>
                  </div>
                </div>
                <div className="home-modal-footer">
                  <button className="btn-primary" onClick={() => setSelectedSubItem(null)}>Got it!</button>
                </div>
              </>
            ) : (
              <>
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
                        <div key={idx} className="modal-list-item" onClick={() => setSelectedSubItem(item)}>
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
                        <div key={idx} className="modal-list-item" onClick={() => setSelectedSubItem(item)}>
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
                        <div key={idx} className="modal-list-item certificate-item" onClick={() => setSelectedSubItem(item)}>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
