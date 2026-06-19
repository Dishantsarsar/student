import React from 'react';
import './Engagement.css';

function CommunityPreview() {
  return (
    <section className="community-preview-section">
      <div className="community-glow-bg"></div>
      <div className="community-content">
        <div className="community-text">
          <h2 className="section-title-gradient">Join our Developer Community</h2>
          <p>
            Don't learn alone. Join our private Discord to participate in weekly challenges, get your code reviewed, and network with peers.
          </p>
          <ul className="community-perks">
            <li>✅ 24/7 Peer Support</li>
            <li>✅ Weekly Hackathons</li>
            <li>✅ Exclusive Webinars</li>
            <li>✅ Resume Reviews</li>
          </ul>
          <button className="btn-primary community-btn">Join Discord Community</button>
        </div>
        <div className="community-visual">
          <div className="mock-chat-bubble bubble-1 hover-lift">
            <strong>Alex:</strong> "Can someone review my React project?"
          </div>
          <div className="mock-chat-bubble bubble-2 hover-lift">
            <strong>Sarah (Mentor):</strong> "Sure, Alex! Looking at your repo now."
          </div>
          <div className="mock-chat-bubble bubble-3 hover-lift">
            <strong>System:</strong> "🎉 Priya just landed a job at Stripe!"
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunityPreview;
