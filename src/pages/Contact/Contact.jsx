import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Please fill out the form below or reach out to us directly.</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <div className="info-item">
            <span className="icon">📍</span>
            <p>123 Tech Street, Silicon Valley, CA 94000</p>
          </div>
          <div className="info-item">
            <span className="icon">📧</span>
            <p>support@solutionadda.com</p>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <p>+1 (555) 123-4567</p>
          </div>
          
          <div className="contact-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <span role="img" aria-label="twitter">🐦</span>
              <span role="img" aria-label="facebook">📘</span>
              <span role="img" aria-label="instagram">📸</span>
              <span role="img" aria-label="linkedin">💼</span>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="How can we help?" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" className="btn-primary form-submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
