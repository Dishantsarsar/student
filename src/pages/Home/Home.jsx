import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../components/Chatbot/Chatbot';
import RecommendedCourses from '../../components/Engagement/RecommendedCourses';
import Testimonials from '../../components/Engagement/Testimonials';
import FAQAccordion from '../../components/Engagement/FAQAccordion';
import CareerRoadmapPreview from '../../components/Engagement/CareerRoadmapPreview';
import InstructorSpotlight from '../../components/Engagement/InstructorSpotlight';
import CommunityPreview from '../../components/Engagement/CommunityPreview';
import './Home.css';

// Counter component for animated counters
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

function Counter({ end, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    if (end <= 0) return;
    const increment = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end, isVisible]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Home() {
  const navigate = useNavigate();
  // Why Choose Us (featuresData) - modal functionality preserved
  const featuresData = [
    {
      id: "instructors",
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M7 14v4a5 5 0 0 0 10 0v-4" />
          <path d="M22 7v6h-2" />
        </svg>
      ),
      title: "Expert Instructors",
      shortDesc: "Learn directly from experienced industry professionals who simplify complex concepts and share practical real-world knowledge.",
      detailedInfo: "Our instructors are vetted professionals with over 10+ years of experience in top tech companies like Google and Amazon.",
      contentType: "instructors",
      contentList: [
        { name: "John Doe", role: "Senior Frontend Engineer", experience: "10 Years at Google", avatar: "👨‍💻" },
        { name: "Jane Smith", role: "Lead Data Scientist", experience: "8 Years at Amazon", avatar: "👩‍🔬" },
      ]
    },
    {
      id: "projects",
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M10 9l-2 2 2 2" />
          <path d="M14 9l2 2-2 2" />
        </svg>
      ),
      title: "Hands-on Projects",
      shortDesc: "Work on practical projects that strengthen your portfolio and give you the confidence to solve real industry problems.",
      detailedInfo: "Stop watching and start building. Here are some of the projects you will build to prove your skills:",
      contentType: "projects",
      contentList: [
        { name: "E-Commerce Platform", desc: "Build a fully functional store with Stripe integration.", tech: "React, Node, MongoDB", icon: "🛒" },
        { name: "AI Chat Application", desc: "Create a real-time chat app using OpenAI APIs.", tech: "Python, WebSockets", icon: "🤖" }
      ]
    },
    {
      id: "certificates",
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        </svg>
      ),
      title: "Industry-Recognized Certificates",
      shortDesc: "Earn certificates upon course completion that validate your skills and enhance your resume for better career opportunities.",
      detailedInfo: "Earn certificates that prove your skills to employers globally.",
      contentType: "certificates",
      contentList: [
        { name: "Full-Stack Web Development", issuer: "Solution Adda & Partners", image: "📜", highlight: "Industry Recognized" },
        { name: "Data Science Bootcamp", issuer: "Solution Adda & Partners", image: "🎓", highlight: "Verified Credential" }
      ]
    },
    {
      id: "community",
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Community & Mentor Support",
      shortDesc: "Become part of an active learning community where mentors and peers support your growth throughout your learning journey.",
      detailedInfo: "Get 24/7 access to our private Discord server. Participate in weekly hackathons, study groups, and get instant debugging help from peers and alumni who have already landed top jobs.",
      contentType: "text",
      contentList: []
    },
    {
      id: "career",
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5C4 22 6 21 7.5 19.5" />
          <path d="M12 2C6 2 2 6 2 12c0 3.5 1.5 6.5 4 8.5" />
          <path d="M22 2l-6 6" />
          <path d="M9 15l3-3" />
          <path d="M12 2s4 4 10 10c0 0-4-4-10-10z" />
        </svg>
      ),
      title: "Career-Focused Learning",
      shortDesc: "Every course is designed with industry requirements in mind, helping you become job-ready through practical and relevant skills.",
      detailedInfo: "Every single course is aligned with current job descriptions in the industry. We provide career support, resume reviews, portfolio setup guidelines, and mock interviews to make sure you successfully pass technical screens.",
      contentType: "text",
      contentList: []
    },
    {
      id: "roadmap",
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      title: "Structured Learning Roadmap",
      shortDesc: "Follow a clear, step-by-step roadmap that guides you from beginner to advanced without confusion or information overload.",
      detailedInfo: "Don't get lost in tutorial hell. Our structured roadmaps take you step-by-step from core syntax to complex system design. Every milestone has direct assessments to verify you have fully mastered the concepts before moving on.",
      contentType: "text",
      contentList: []
    }
  ];

  const [selectedFeature, setSelectedFeature] = useState(null);
  const openModal = (feature) => setSelectedFeature(feature);
  const closeModal = () => setSelectedFeature(null);

  const motivationalMessages = [
    "Every expert was once a beginner.",
    "Learn today, lead tomorrow.",
    "Small daily progress creates big success.",
    "Your future starts with one lesson.",
    "Your dream career begins here."
  ];

  const [motivationIndex, setMotivationIndex] = useState(0);
  const [motivationFade, setMotivationFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationFade(false);
      setTimeout(() => {
        setMotivationIndex((prev) => (prev + 1) % motivationalMessages.length);
        setMotivationFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [motivationalMessages.length]);

  return (
    <div className="home-container">
      {/* SECTION 1: Hero */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">New: AI & Machine Learning Courses! 🚀</div>
          <h1 className="hero-title">Unlock Your Future in <span className="highlight">Tech</span></h1>
          <p className="hero-subtitle">
            Master the most in-demand skills with our comprehensive, expert-led courses in Web Development, AI, Cloud Computing, and more.
          </p>
          <div className={`motivational-message ${motivationFade ? 'fade-in' : 'fade-out'}`}>
            <p>✨ {motivationalMessages[motivationIndex]}</p>
          </div>
          <div className="hero-buttons">
            <Link to="/courses" className="btn-primary">Explore Courses</Link>
            <a href="#overview" className="btn-secondary">Learn More</a>
          </div>
        </div>
        
        {/* Interactive LMS Dashboard Illustration */}
        <div className="hero-visual-container">
          <div className="gradient-glow-orb orb-1"></div>
          <div className="gradient-glow-orb orb-2"></div>
          
          <div className="laptop-mockup">
            <div className="laptop-screen">
              <div className="dashboard-header">
                <span className="window-dots"><span className="red"></span><span className="yellow"></span><span className="green"></span></span>
                <span className="dashboard-title">Student Dashboard Console</span>
              </div>
              <div className="dashboard-editor">
                <div className="dashboard-row flex justify-between">
                  <div className="lms-card-mini">
                    <span className="lms-card-title">Enrolled Courses</span>
                    <span className="lms-card-value font-bold">5 Courses</span>
                  </div>
                  <div className="lms-card-mini">
                    <span className="lms-card-title">Overall Progress</span>
                    <span className="lms-card-value font-bold text-cyan">78%</span>
                  </div>
                </div>
                <div className="dashboard-progress-track">
                  <div className="progress-label flex justify-between">
                    <span>Web Development Bootcamp</span>
                    <span>85%</span>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div className="dashboard-progress-track">
                  <div className="progress-label flex justify-between">
                    <span>Machine Learning Essentials</span>
                    <span>45%</span>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '45%' }}></div></div>
                </div>
              </div>
              <div className="dashboard-chart-preview">
                <div className="chart-bar bar-1"></div>
                <div className="chart-bar bar-2"></div>
                <div className="chart-bar bar-3"></div>
                <div className="chart-bar bar-4"></div>
              </div>
            </div>
            <div className="laptop-base">
              <div className="keyboard-indent"></div>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="floating-badge badge-projects">
            <span className="badge-icon">✓</span>
            <span>Live Projects</span>
          </div>
          <div className="floating-badge badge-mentors">
            <span className="badge-icon">✓</span>
            <span>Industry Mentors</span>
          </div>
          <div className="floating-badge badge-skills">
            <span className="badge-icon">✓</span>
            <span>Job-Ready Skills</span>
          </div>
          <div className="floating-badge badge-support">
            <span className="badge-icon">✓</span>
            <span>Community Support</span>
          </div>
          <div className="floating-badge badge-certs">
            <span className="badge-icon">✓</span>
            <span>Certificates</span>
          </div>
          <div className="floating-badge badge-guidance">
            <span className="badge-icon">✓</span>
            <span>Career Guidance</span>
          </div>
        </div>
      </header>

      {/* SECTION 2: Platform Overview */}
      <section className="overview-section" id="overview">
        <div className="section-header">
          <h2 className="section-title-gradient">One Platform for Modern Digital Learning</h2>
          <p className="section-subtitle-center">
            Bridge the gap between traditional education and digital accessibility through a centralized learning platform designed for students and instructors.
          </p>
        </div>
        <div className="overview-content-grid">
          <div className="overview-illustration-side">
            <div className="illustration-wrapper">
              <div className="circle-bg"></div>
              <div className="mock-browser">
                <div className="browser-header">
                  <span className="dots"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span></span>
                </div>
                <div className="browser-body">
                  <div className="mock-video-player">
                    <div className="play-button">▶</div>
                    <div className="video-progress"></div>
                  </div>
                  <div className="mock-instructor-card">
                    <div className="avatar">👨‍🏫</div>
                    <div className="details">
                      <div className="name">Expert Instructor</div>
                      <div className="meta">10+ Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overview-list-side">
            <ul className="overview-checklist">
              <li>
                <span className="check-icon">✓</span>
                <div className="checklist-text">
                  <h3>Browse Premium Courses</h3>
                  <p>Access structured learning paths spanning Web Dev, AI, Cloud, and Python.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div className="checklist-text">
                  <h3>Watch Video Lectures</h3>
                  <p>High-quality streams with auto-resume functions to learn at your pace.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div className="checklist-text">
                  <h3>Track Learning Progress</h3>
                  <p>Visual statistics detailing your lessons, chapters, and completion milestones.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div className="checklist-text">
                  <h3>Earn Certificates</h3>
                  <p>Get recognized for your skills with partner-backed credentials.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div className="checklist-text">
                  <h3>Learn from Industry Experts</h3>
                  <p>Mentorship from vetted software engineers and architects.</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div className="checklist-text">
                  <h3>Responsive Dashboard</h3>
                  <p>Fully functional platform interface matching all devices smoothly.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: Core Student Features */}
      <section className="core-features-section">
        <div className="section-header">
          <h2 className="section-title-gradient">Core Student Features</h2>
          <p className="section-subtitle-center">Empowering elements designed to accelerate comprehension and performance.</p>
        </div>
        <div className="core-features-grid">
          <Link to="/courses" className="core-feature-card" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="core-icon-wrapper">🔍</div>
            <h3>Course Discovery</h3>
            <p>Advanced search and filtering to quickly find relevant courses.</p>
            <div className="glow-overlay"></div>
          </Link>
          <div className="core-feature-card">
            <div className="core-icon-wrapper">🎥</div>
            <h3>Video Learning</h3>
            <p>Integrated high-quality video player with resume functionality.</p>
            <div className="glow-overlay"></div>
          </div>
          <div className="core-feature-card">
            <div className="core-icon-wrapper">📈</div>
            <h3>Progress Analytics</h3>
            <p>Track completion percentage and learning milestones.</p>
            <div className="glow-overlay"></div>
          </div>
          <div className="core-feature-card">
            <div className="core-icon-wrapper">💻</div>
            <h3>Hands-on Projects</h3>
            <p>Practice with real-world assignments.</p>
            <div className="glow-overlay"></div>
          </div>
          <div className="core-feature-card">
            <div className="core-icon-wrapper">📜</div>
            <h3>Certification</h3>
            <p>Receive certificates after course completion.</p>
            <div className="glow-overlay"></div>
          </div>
          <div className="core-feature-card">
            <div className="core-icon-wrapper">👥</div>
            <h3>Community Support</h3>
            <p>Collaborate with mentors and fellow learners.</p>
            <div className="glow-overlay"></div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Learning Workflow (Timeline) */}
      <section className="workflow-section">
        <div className="section-header">
          <h2 className="section-title-gradient">Your Learning Workflow</h2>
          <p className="section-subtitle-center">Follow our structured path to master technologies and launch your tech career.</p>
        </div>
        <div className="workflow-timeline">
          <div 
            className="timeline-step interactive" 
            onClick={() => navigate('/courses')}
            role="button"
            tabIndex={0}
          >
            <div className="step-num">1</div>
            <h4>Explore Courses</h4>
            <span className="connector-arrow">→</span>
          </div>
          <div 
            className="timeline-step interactive"
            onClick={() => {
              const isAuth = !!localStorage.getItem('sa_user');
              navigate(isAuth ? '/courses' : '/auth');
            }}
            role="button"
            tabIndex={0}
          >
            <div className="step-num">2</div>
            <h4>Enroll</h4>
            <span className="connector-arrow">→</span>
          </div>
          <div className="timeline-step pending" title="Coming Soon – This feature will be available in the next update.">
            <div className="step-num">3</div>
            <h4>Watch Lessons</h4>
            <span className="connector-arrow">→</span>
          </div>
          <div className="timeline-step pending" title="Coming Soon – This feature will be available in the next update.">
            <div className="step-num">4</div>
            <h4>Complete Projects</h4>
            <span className="connector-arrow">→</span>
          </div>
          <div className="timeline-step pending" title="Coming Soon – This feature will be available in the next update.">
            <div className="step-num">5</div>
            <h4>Track Progress</h4>
            <span className="connector-arrow">→</span>
          </div>
          <div className="timeline-step pending" title="Coming Soon – This feature will be available in the next update.">
            <div className="step-num">6</div>
            <h4>Earn Certificate</h4>
            <span className="connector-arrow">→</span>
          </div>
          <div className="timeline-step pending" title="Coming Soon – This feature will be available in the next update.">
            <div className="step-num">7</div>
            <h4>Get Career Ready</h4>
          </div>
        </div>
      </section>

      {/* SECTION 5: Trending Courses & Roadmap */}
      <RecommendedCourses type="trending" onCourseClick={(c) => navigate('/courses')} />
      <CareerRoadmapPreview />

      {/* SECTION 6: Why Students Love Solution Adda */}
      <section className="student-love-section">
        <div className="section-header">
          <h2 className="section-title-gradient">Why Students Love Solution Adda</h2>
          <p className="section-subtitle-center">Built specifically for developer education, visual learners, and career builders.</p>
        </div>
        <div className="student-love-grid">
          <div className="love-card">
            <div className="love-icon">🎯</div>
            <h4>Smart Course Discovery</h4>
            <p>Filter by level, topic, or tech stack to find exactly what you want.</p>
          </div>
          <div className="love-card">
            <div className="love-icon">📺</div>
            <h4>Integrated Video Learning</h4>
            <p>Access high-definition video playback with memory state tracking.</p>
          </div>
          <div className="love-card">
            <div className="love-icon">📊</div>
            <h4>Progress Dashboard</h4>
            <p>View completion counts and modules left in custom analytics cards.</p>
          </div>
          <div className="love-card">
            <div className="love-icon">🔑</div>
            <h4>Secure Authentication</h4>
            <p>Session tokens are encrypted and role permissions protect dashboards.</p>
          </div>
          <div className="love-card">
            <div className="love-icon">⚡</div>
            <h4>Fast Performance</h4>
            <p>Webpack-optimized builds deliver lightning-fast initial load times.</p>
          </div>
          <div className="love-card">
            <div className="love-icon">📱</div>
            <h4>Responsive Design</h4>
            <p>Enjoy desktop features when studying on tablets and smartphones.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Instructor Spotlight */}
      <InstructorSpotlight />

      {/* SECTION 8: Learning Analytics (Stats) */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">👥</div>
            <div className="stat-number"><Counter end={5000} suffix="+" /></div>
            <div className="stat-label">Students Enrolled</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">💻</div>
            <div className="stat-number"><Counter end={100} suffix="+" /></div>
            <div className="stat-label">Hands-on Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">📚</div>
            <div className="stat-number"><Counter end={50} suffix="+" /></div>
            <div className="stat-label">Premium Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">⏱️</div>
            <div className="stat-number"><Counter end={10000} suffix="+" /></div>
            <div className="stat-label">Hours of Learning</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">😊</div>
            <div className="stat-number"><Counter end={95} suffix="%" /></div>
            <div className="stat-label">Course Completion Satisfaction</div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Testimonials */}
      <Testimonials />

      {/* SECTION 10: Future Ready */}
      <section className="future-ready-section">
        <div className="section-header">
          <h2 className="section-title-gradient">The Future of Learning Starts Here</h2>
          <p className="section-subtitle-center">Sneak peek at upcoming AI features and collaborative modules scheduled soon.</p>
        </div>
        <div className="future-grid">
          <div className="future-card-item">
            <h4>AI-Powered Course Recommendations</h4>
            <p>Personalized suggestions targeting gaps in student portfolios.</p>
          </div>
          <div className="future-card-item">
            <h4>Personalized Learning Paths</h4>
            <p>Dynamic timelines adjusting to individual speed and goals.</p>
          </div>
          <div className="future-card-item">
            <h4>Peer-to-Peer Collaboration</h4>
            <p>Pair programming features directly in the workspace.</p>
          </div>
          <div className="future-card-item">
            <h4>Real-Time Messaging</h4>
            <p>Connect with peers and instructors instantly in code chatrooms.</p>
          </div>
          <div className="future-card-item">
            <h4>Smart Learning Analytics</h4>
            <p>Receive reports detailing key study behaviors and habits.</p>
          </div>
          <div className="future-card-item">
            <h4>Adaptive Assessments</h4>
            <p>Self-adjusting tests matching your current level of competence.</p>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <CommunityPreview />

      {/* SECTION 11: Why Choose Us (Modal features preserved) */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title-gradient">Why Choose Solution Adda?</h2>
          <p className="section-subtitle-center">
            Discover a learning platform designed to help you master in-demand skills, build real-world experience, and confidently achieve your career goals.
          </p>
        </div>
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

      {/* FAQ Section */}
      <FAQAccordion />

      {/* SECTION 12: Call To Action */}
      <section className="cta-section-wrapper">
        <div className="cta-glow-bg"></div>
        <div className="cta-content">
          <h2 className="cta-title">Start Your Learning Journey Today</h2>
          <p className="cta-subheading">
            Learn modern technologies through practical projects, expert guidance, and an interactive learning platform designed for career growth.
          </p>
          <div className="cta-buttons flex justify-center gap-4">
            <Link to="/courses" className="btn-cta-explore">Explore Courses</Link>
            <Link to="/auth" className="btn-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Feature Details Modal (Why Choose Us detailed popup) */}
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

      <Chatbot />
    </div>
  );
}

export default Home;
