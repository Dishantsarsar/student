import React, { useState } from 'react';
import './Engagement.css';

const faqs = [
  {
    q: "Do I need prior coding experience?",
    a: "Not necessarily! We offer courses ranging from complete beginner to advanced. Look for the 'Beginner' tag when browsing."
  },
  {
    q: "Will I get a certificate upon completion?",
    a: "Yes, all our paid courses and most free bootcamps include a verifiable certificate of completion that you can add to your LinkedIn profile."
  },
  {
    q: "How long do I have access to the courses?",
    a: "Once enrolled, you have lifetime access to the course content, including any future updates the instructor makes."
  },
  {
    q: "Is there a community or mentorship available?",
    a: "Absolutely! We have a vibrant Discord community where you can interact with peers, and our premium plans include 1-on-1 mentorship."
  }
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="section-header">
        <h2 className="section-title-gradient">Frequently Asked Questions</h2>
        <p className="section-subtitle-center">Everything you need to know about learning with Solution Adda.</p>
      </div>
      <div className="faq-container">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className={`faq-item ${openIndex === idx ? 'open' : ''}`}
            onClick={() => toggleFAQ(idx)}
          >
            <div className="faq-question">
              <h3>{faq.q}</h3>
              <span className="faq-icon">{openIndex === idx ? '−' : '+'}</span>
            </div>
            <div className="faq-answer">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQAccordion;
