import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const kb = [
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'],
    answer: 'Hello! Welcome to Solution Adda Support. How can I help you today? Feel free to ask about our courses, instructors, certificates, pricing, or anything else!'
  },
  {
    keywords: ['what is solution adda', 'about solution adda', 'tell me about', 'who are you', 'about platform'],
    answer: 'Solution Adda is an online learning platform offering expert-led courses in Web Development, AI, Machine Learning, Data Science, Cloud Computing, and Python Programming. We focus on hands-on learning with real-world projects.'
  },
  {
    keywords: ['course', 'courses', 'what courses', 'offer', 'topics', 'subjects', 'what can i learn', 'programs'],
    answer: 'We offer courses in: Web Development (React, Node.js, MongoDB), AI & Machine Learning, Data Science, Cloud Computing, and Python Programming. Each includes hands-on projects, mentorship, and a certificate.'
  },
  {
    keywords: ['web development', 'web dev', 'frontend', 'backend', 'full stack', 'mern', 'react', 'node'],
    answer: 'Our Web Development track covers HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. You build real projects like an E-Commerce Platform with Stripe and an AI Chat Application.'
  },
  {
    keywords: ['ai', 'machine learning', 'ml', 'artificial intelligence', 'data science', 'deep learning'],
    answer: 'Our AI & ML courses cover Python, TensorFlow, PyTorch, NLP, and Computer Vision. You work on real datasets and build production-ready models.'
  },
  {
    keywords: ['instructor', 'teacher', 'expert', 'who teaches', 'mentor', 'faculty'],
    answer: 'Our instructors have 10+ years of experience from top companies like Google, Amazon, and Microsoft. They provide personalized feedback on your work.'
  },
  {
    keywords: ['certificate', 'certification', 'cert', 'recognized', 'proof', 'completion'],
    answer: 'Yes! You earn industry-recognized certificates after completing each course. They include your name, skills covered, and are verified for LinkedIn.'
  },
  {
    keywords: ['project', 'hands-on', 'practical', 'build', 'portfolio', 'real world'],
    answer: 'You build real projects like an E-Commerce Platform, AI Chat App, Data Analytics Dashboard, and Cloud Deployment projects — all go into your portfolio.'
  },
  {
    keywords: ['community', 'discord', 'support', 'group', 'discuss'],
    answer: 'You get 24/7 access to our private Discord server with hackathons, study groups, debugging help, mentorship, and alumni networking.'
  },
  {
    keywords: ['price', 'cost', 'fee', 'pricing', 'payment', 'how much', 'rupees'],
    answer: 'Competitive pricing with free introductory modules, EMI options, and a 7-day money-back guarantee. Check course pages for details.'
  },
  {
    keywords: ['enroll', 'sign up', 'register', 'join', 'admission', 'start', 'enrollment'],
    answer: 'Click "Sign Up" in the top-right, create your account, choose a course, and start learning immediately!'
  },
  {
    keywords: ['duration', 'how long', 'weeks', 'months', 'self paced', 'self-paced', 'timeline'],
    answer: 'Courses are 4-12 weeks, self-paced with lifetime access. No deadlines — learn at your own speed.'
  },
  {
    keywords: ['refund', 'cancel', 'money back', 'guarantee'],
    answer: '7-day money-back guarantee on most courses. No questions asked. Contact support@solutionadda.com to initiate.'
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone', 'support team'],
    answer: 'Email: support@solutionadda.com, Discord community, or this chat bot 24/7.'
  },
  {
    keywords: ['job', 'career', 'placement', 'interview', 'resume', 'job ready'],
    answer: 'We offer portfolio projects, certificates, mock interviews, resume reviews, alumni network, and career guidance.'
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
    answer: 'You are welcome! Feel free to ask if you have more questions. Happy learning with Solution Adda!'
  },
  {
    keywords: ['payment', 'pay', 'card', 'upi', 'net banking', 'bank'],
    answer: 'We accept Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, and EMI options.'
  },
  {
    keywords: ['language', 'hindi', 'english'],
    answer: 'Courses are primarily in English. Some popular courses include Hindi explanations for complex topics.'
  },
  {
    keywords: ['laptop', 'mobile', 'app', 'device', 'phone', 'system requirement'],
    answer: 'Access from any device with internet — laptop, mobile, or tablet. Any modern browser works. No app needed.'
  }
];

function findLocal(msg) {
  const lower = msg.toLowerCase().replace(/[?.!,]/g, '');
  let best = null, bestScore = 0;
  for (const item of kb) {
    let score = 0;
    for (const kw of item.keywords) {
      if (lower.includes(kw)) score += kw.split(/\s+/).length;
    }
    if (score > bestScore) { bestScore = score; best = item.answer; }
  }
  return bestScore > 0 ? best : null;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Solution Adda support bot. Ask me anything about our platform!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal
      });
      clearTimeout(timer);
      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not generate a response.';
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    } catch {
      clearTimeout(timer);
      const local = findLocal(trimmed);
      if (local) {
        setMessages((prev) => [...prev, { from: 'bot', text: local }]);
      } else {
        setMessages((prev) => [...prev, { from: 'bot', text: 'I am not sure about that. Please ask me about our courses, instructors, certificates, pricing, community, or anything related to Solution Adda!' }]);
      }
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') send();
  };

  return (
    <>
      <button className={`chat-fab ${open ? 'hidden' : ''}`} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="fab-pulse" />
      </button>

      <div className={`chat-panel ${open ? 'open' : ''}`}>
        <div className="chat-head">
          <div className="chat-head-left">
            <div className="chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <span className="chat-name">Solution Adda Support</span>
              <span className="chat-status">Online</span>
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.from}`}>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg bot">
              <div className="msg-bubble">Thinking...</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat-foot">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button className="chat-send" onClick={send} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
