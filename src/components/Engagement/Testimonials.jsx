import React from 'react';
import './Engagement.css';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Frontend Developer at TechCorp",
    image: "👩‍💻",
    quote: "The interactive projects completely transformed my portfolio. I landed my first job within 2 months of completing the React track.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    image: "👨‍🔬",
    quote: "The machine learning curriculum is top-notch. It bridged the gap between theory and actual industry application for me.",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "UX Engineer",
    image: "👩‍🎨",
    quote: "I loved the focus on design systems and micro-interactions. The platform itself is a great example of what they teach.",
    rating: 4.9
  }
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2 className="section-title-gradient">Student Success Stories</h2>
        <p className="section-subtitle-center">Hear from our alumni who have transformed their careers.</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <div key={idx} className="testimonial-card hover-lift">
            <div className="testimonial-header">
              <div className="testimonial-avatar">{t.image}</div>
              <div className="testimonial-info">
                <h4>{t.name}</h4>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </div>
            <div className="testimonial-stars">
              {"★".repeat(Math.floor(t.rating))}{t.rating % 1 !== 0 ? "½" : ""}
            </div>
            <p className="testimonial-quote">"{t.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
