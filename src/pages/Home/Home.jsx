import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from '../../components/Chatbot/Chatbot';
import SectionReveal, { RevealItem } from '../../components/ui/SectionReveal';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import './Home.css';

function Home() {
  const featuresData = [
    {
      id: "instructors",
      icon: "👨‍🏫",
      title: "Expert Instructors",
      shortDesc: "Learn directly from experienced industry professionals who simplify complex concepts.",
      detailedInfo: "Our instructors are vetted professionals with over 10+ years of experience in top tech companies like Google and Amazon.",
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
      shortDesc: "Work on practical projects that strengthen your portfolio and confidence.",
      detailedInfo: "Stop watching and start building. Here are some of the projects you will build to prove your skills:",
      contentType: "projects",
      contentList: [
        { name: "E-Commerce Platform", desc: "Build a fully functional store with Stripe integration.", tech: "React, Node, MongoDB", icon: "🛒" },
        { name: "AI Chat Application", desc: "Create a real-time chat app using OpenAI APIs.", tech: "Python, WebSockets", icon: "🤖" }
      ]
    },
    {
      id: "certificates",
      icon: "🎓",
      title: "Industry-Recognized Certificates",
      shortDesc: "Earn certificates upon course completion that validate your skills.",
      detailedInfo: "Earn certificates that prove your skills to employers globally.",
      contentType: "certificates",
      contentList: [
        { name: "Full-Stack Web Development", issuer: "Solution Adda & Partners", image: "📜", highlight: "Industry Recognized" },
        { name: "Data Science Bootcamp", issuer: "Solution Adda & Partners", image: "🎓", highlight: "Verified Credential" }
      ]
    },
    {
      id: "community",
      icon: "🌐",
      title: "Community & Mentor Support",
      shortDesc: "Become part of an active learning community where mentors and peers support you.",
      detailedInfo: "Get 24/7 access to our private Discord server. Participate in weekly hackathons, study groups, and get instant debugging help.",
      contentType: "text",
      contentList: []
    },
    {
      id: "career",
      icon: "🚀",
      title: "Career-Focused Learning",
      shortDesc: "Every course is designed with industry requirements in mind, making you job-ready.",
      detailedInfo: "Every single course is aligned with current job descriptions in the industry. We provide career support, resume reviews, and mock interviews.",
      contentType: "text",
      contentList: []
    },
    {
      id: "roadmap",
      icon: "🗺️",
      title: "Structured Learning Roadmap",
      shortDesc: "Follow a clear, step-by-step roadmap that guides you from beginner to advanced.",
      detailedInfo: "Don't get lost in tutorial hell. Our structured roadmaps take you step-by-step from core syntax to complex system design.",
      contentType: "text",
      contentList: []
    }
  ];

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const workflowSteps = [
    { title: 'Explore', desc: 'Discover premium courses tailored to your career goals.' },
    { title: 'Enroll', desc: 'Sign up and get instant access to all course materials.' },
    { title: 'Watch', desc: 'Learn from high-quality, on-demand video lectures.' },
    { title: 'Build', desc: 'Apply your knowledge through hands-on practical projects.' },
    { title: 'Track', desc: 'Monitor your progress and stay motivated with our dashboard.' },
    { title: 'Certify', desc: 'Earn verifiable certificates upon successful completion.' },
    { title: 'Career', desc: 'Unlock new career opportunities with your upgraded skills.' }
  ];

  return (
    <div className="home-container">
      <AnimatedBackground variant="dynamic" />

      {/* Hero Section */}
      <section className="premium-hero">
        <div className="hero-content">
          <SectionReveal direction="down" delay={0.1}>
            <div className="hero-badge">
              <span className="badge-dot"></span> New: AI & Machine Learning Courses! 🚀
            </div>
            <h1 className="hero-title">
              Unlock Your Future in <span className="text-gradient">Tech</span>
            </h1>
            <p className="hero-subtitle">
              Master the most in-demand skills with our comprehensive, expert-led courses in Web Development, AI, Cloud Computing, and more.
            </p>
            <div className="hero-cta-group">
              <Link to="/courses">
                <Button size="lg" variant="primary">Explore Courses</Button>
              </Link>
              <a href="#overview">
                <Button size="lg" variant="secondary">Learn More</Button>
              </a>
            </div>
          </SectionReveal>
        </div>

        {/* Abstract 3D/Glass Visual for Hero */}
        <div className="hero-visual">
          <SectionReveal direction="up" delay={0.3}>
            <GlassCard glow hover={false} className="mockup-card">
              <div className="mockup-header">
                <div className="window-controls">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="mockup-title">Student Dashboard</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-stats">
                  <div className="mock-stat-box">
                    <span>Enrolled Courses</span>
                    <strong>5 Courses</strong>
                  </div>
                  <div className="mock-stat-box">
                    <span>Overall Progress</span>
                    <strong className="text-cyan">78%</strong>
                  </div>
                </div>
                <div className="mockup-progress">
                  <div className="prog-label">
                    <span>Web Development Bootcamp</span>
                    <span>85%</span>
                  </div>
                  <div className="prog-bar"><div className="prog-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div className="mockup-progress">
                  <div className="prog-label">
                    <span>Machine Learning Essentials</span>
                    <span>45%</span>
                  </div>
                  <div className="prog-bar"><div className="prog-fill" style={{ width: '45%' }}></div></div>
                </div>
                <div className="mockup-chart">
                  <div className="chart-bar" style={{ height: '40%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                  <div className="chart-bar" style={{ height: '50%' }}></div>
                  <div className="chart-bar" style={{ height: '90%' }}></div>
                </div>
              </div>
            </GlassCard>
            
            {/* Floating Tags */}
            <motion.div className="floating-tag tag-1" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <span>✓ Live Projects</span>
            </motion.div>
            <motion.div className="floating-tag tag-2" animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}>
              <span>✓ Industry Mentors</span>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="overview" className="section-padding">
        <SectionReveal direction="up">
          <div className="section-header-center">
            <h2 className="section-title">One Platform for <span className="text-gradient">Modern Learning</span></h2>
            <p className="section-subtitle">Bridge the gap between traditional education and digital accessibility.</p>
          </div>
        </SectionReveal>

        <div className="overview-grid">
          <SectionReveal direction="left" className="overview-illustration">
             <GlassCard className="browser-mockup">
               <div className="browser-top">
                 <div className="window-controls">
                   <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                 </div>
               </div>
               <div className="browser-content">
                 <div className="video-skeleton">
                   <div className="play-btn">▶</div>
                 </div>
                 <div className="instructor-badge-skel">
                    <div className="ava">👨‍🏫</div>
                    <div className="inf">
                      <div className="n">Expert Instructor</div>
                      <div className="d">10+ Years Experience</div>
                    </div>
                 </div>
               </div>
             </GlassCard>
          </SectionReveal>
          
          <SectionReveal direction="right" className="overview-list">
            <ul className="premium-checklist">
              <li>
                <div className="check-ring">✓</div>
                <div>
                  <h3>Browse Premium Courses</h3>
                  <p>Access structured learning paths spanning Web Dev, AI, Cloud, and Python.</p>
                </div>
              </li>
              <li>
                <div className="check-ring">✓</div>
                <div>
                  <h3>Watch Video Lectures</h3>
                  <p>High-quality streams with auto-resume functions to learn at your pace.</p>
                </div>
              </li>
              <li>
                <div className="check-ring">✓</div>
                <div>
                  <h3>Track Learning Progress</h3>
                  <p>Visual statistics detailing your lessons, chapters, and completion milestones.</p>
                </div>
              </li>
              <li>
                <div className="check-ring">✓</div>
                <div>
                  <h3>Earn Certificates</h3>
                  <p>Get recognized for your skills with partner-backed credentials.</p>
                </div>
              </li>
            </ul>
          </SectionReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding section-darker">
        <SectionReveal direction="up">
          <div className="section-header-center">
            <h2 className="section-title">Why Choose <span className="text-gradient">Solution Adda?</span></h2>
            <p className="section-subtitle">Discover a learning platform designed to help you master in-demand skills.</p>
          </div>
        </SectionReveal>

        <SectionReveal stagger={true} className="premium-features-grid">
          {featuresData.map((feature) => (
            <RevealItem key={feature.id}>
              <GlassCard 
                className="feature-interactive-card" 
                hover 
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="feature-icon-large">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.shortDesc}</p>
                <div className="learn-more-link">Learn More →</div>
              </GlassCard>
            </RevealItem>
          ))}
        </SectionReveal>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <SectionReveal stagger={true} className="stats-container">
          <RevealItem><StatCard icon="👥" label="Students Enrolled" value={5000} suffix="+" gradient="cyan" /></RevealItem>
          <RevealItem><StatCard icon="💻" label="Hands-on Projects" value={100} suffix="+" gradient="magenta" /></RevealItem>
          <RevealItem><StatCard icon="📚" label="Premium Courses" value={50} suffix="+" gradient="blue" /></RevealItem>
          <RevealItem><StatCard icon="😊" label="Satisfaction" value={95} suffix="%" gradient="green" /></RevealItem>
        </SectionReveal>
      </section>

      {/* Workflow Section */}
      <section className="section-padding section-darker">
        <SectionReveal direction="up">
          <div className="section-header-center">
            <h2 className="section-title">Your Learning <span className="text-gradient">Workflow</span></h2>
          </div>
        </SectionReveal>
        
        <div className="workflow-interactive-container">
          <SectionReveal stagger={true} className="workflow-timeline-premium">
            {workflowSteps.map((step, idx) => (
               <RevealItem 
                 key={idx} 
                 className={`timeline-node ${activeWorkflow === idx ? 'active' : ''}`}
                 onClick={() => setActiveWorkflow(idx)}
               >
                 <div className="node-circle">{idx + 1}</div>
                 <div className="node-label">{step.title}</div>
               </RevealItem>
            ))}
          </SectionReveal>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeWorkflow}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="workflow-step-details"
            >
              <h3>{workflowSteps[activeWorkflow].title}</h3>
              <p>{workflowSteps[activeWorkflow].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding cta-premium-section">
        <SectionReveal direction="scale">
          <GlassCard glow className="cta-box">
            <h2 className="cta-title">Start Your Learning Journey Today</h2>
            <p className="cta-desc">Learn modern technologies through practical projects and expert guidance.</p>
            <div className="cta-actions">
              <Link to="/courses"><Button size="lg" variant="primary">Explore Courses</Button></Link>
              <Link to="/auth"><Button size="lg" variant="secondary">Sign Up Now</Button></Link>
            </div>
          </GlassCard>
        </SectionReveal>
      </section>

      {/* Feature Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div 
            className="premium-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div 
              className="premium-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedFeature(null)}>✕</button>
              <div className="modal-header-icon">{selectedFeature.icon}</div>
              <h2 className="modal-title">{selectedFeature.title}</h2>
              <p className="modal-desc">{selectedFeature.detailedInfo}</p>

              {selectedFeature.contentList && selectedFeature.contentList.length > 0 && (
                <div className="modal-items-grid">
                  {selectedFeature.contentList.map((item, idx) => (
                    <div key={idx} className="modal-item-box">
                      <div className="mi-avatar">{item.avatar || item.icon || item.image}</div>
                      <div className="mi-info">
                        <h4>{item.name}</h4>
                        <p>{item.role || item.desc || item.issuer}</p>
                        <span className="mi-meta">{item.experience || item.tech || item.highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Chatbot />
    </div>
  );
}

export default Home;
