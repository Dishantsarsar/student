## package.json

```json
{
  "name": "student",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "proxy": "http://localhost:4000",
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^13.5.0",
    "framer-motion": "^12.42.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-router-dom": "^7.17.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "react-start": "react-scripts start",
    "dev": "node scripts/start.js",
    "start": "node scripts/start.js",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "^10.5.2",
    "concurrently": "^10.0.3",
    "postcss": "^8.5.15",
    "tailwindcss": "^3.4.19"
  }
}

```

## scripts/start.js

```js
import { spawnSync, execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

function killPort(port) {
  try {
    const res = spawnSync('netstat', ['-ano'], { encoding: 'utf8', shell: true });
    for (const line of res.stdout.split('\n')) {
      if (line.includes(`:${port} `)) {
        const pid = line.trim().split(/\s+/).pop();
        if (pid && !isNaN(pid)) execSync(`taskkill /PID ${pid} /F 2>nul`, { stdio: 'ignore' });
      }
    }
  } catch {}
}

killPort(3000);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

spawn('cmd', ['/c', 'npm run react-start'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
}).on('exit', process.exit);

```

## server/index.js

```js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a support assistant for "Solution Adda" — an online learning platform. Answer ONLY based on the facts below. If the question is not related to Solution Adda, politely say you can only answer about Solution Adda.

ABOUT:
Solution Adda is an online learning platform offering expert-led courses in Web Development, AI, Machine Learning, Data Science, Cloud Computing, and Python. Focus is on hands-on learning with real-world projects.

COURSES:
- Web Development: HTML, CSS, JavaScript, React, Node.js, Express, MongoDB. Projects: E-Commerce Platform (Stripe), AI Chat Application.
- AI & Machine Learning: Python, TensorFlow, PyTorch, NLP, Computer Vision.
- Data Science: Statistics, data visualization, real-world analytics.
- Cloud Computing, Python Programming also available.

INSTRUCTORS:
Vetted professionals with 10+ years from top companies like Google and Amazon.

CERTIFICATES:
Industry-recognized certificates issued by Solution Adda & Partners after course completion.

PRICING:
Competitive pricing, flexible payment options. Free introductory modules available. 7-day money-back guarantee.

ENROLLMENT:
Click "Sign Up", create account, choose a course, start immediately. Self-paced, 4-12 weeks duration.

COMMUNITY:
24/7 Discord access. Weekly hackathons, study groups, debugging help, mentorship from alumni.

CONTACT:
Email: support@solutionadda.com, Discord community, or this chat bot 24/7.

CAREER SUPPORT:
Portfolio projects, certificates, mock interviews, resume reviews, alumni network access.

Keep answers short, friendly, and helpful. Use simple English.`;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('Groq API error:', err.message);
    const detail = err.message || '';
    const userMsg = detail.includes('image')
      ? 'I can only answer text questions. Please type your question instead of sharing files or images.'
      : 'Sorry, I encountered an error. Please try again.';
    res.json({ reply: userMsg });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

```

## server/package.json

```json
{
  "name": "solution-adda-server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "groq-sdk": "^0.5.0"
  }
}

```

## src/App.css

```css
/* ─── App Layout ─── */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - var(--navbar-height, 72px));
  position: relative;
  z-index: 1;
}

/* ─── Page Transition Wrapper ─── */
.page-transition {
  width: 100%;
}

```

## src/App.jsx

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import CommandPalette from './components/ui/CommandPalette';
import InteractiveBackground from './components/ui/InteractiveBackground';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import Auth from './pages/Auth/Auth';
import About from './pages/About/About';
import Admin from './pages/Admin/Admin';
import './App.css';

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.8, 0.25, 1],
};

/* Animated routes wrapper */
function AnimatedRoutes() {
  const location = useLocation();

  /* Scroll to top on every route change */
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-transition"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}


function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <InteractiveBackground />
          <div className="app">
            <CommandPalette />
            <Navbar />
            <main className="main-content">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

```

## src/App.test.jsx

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

## src/components/Chatbot/Chatbot.css

```css
/* ═══ PREMIUM CHATBOT ═══ */

.chat-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  color: #050311;
  box-shadow: 0 8px 30px rgba(0, 242, 254, 0.35);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.chat-fab svg {
  width: 24px;
  height: 24px;
}

.chat-fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 242, 254, 0.45);
}

.chat-fab.hidden {
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.fab-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  border: 2px solid rgba(0, 242, 254, 0.4);
  animation: fabPulse 2s ease-in-out infinite;
}

@keyframes fabPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0; }
}

/* Chat Panel */
.chat-panel {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 380px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  background: rgba(10, 8, 28, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 242, 254, 0.08);
  z-index: 9999;
  overflow: hidden;
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: bottom right;
}

.chat-panel.open {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: all;
}

/* Chat Header */
.chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.chat-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f2fe;
}

.chat-avatar svg {
  width: 18px;
  height: 18px;
}

.chat-name {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  color: #27c93f;
}

.chat-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #27c93f;
  animation: pulse 2s ease-in-out infinite;
}

.chat-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Chat Body */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  max-height: 350px;
}

.chat-body::-webkit-scrollbar {
  width: 3px;
}

.chat-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
}

.chat-msg {
  display: flex;
  max-width: 85%;
  animation: msgSlideIn 0.3s ease;
}

.chat-msg.user {
  align-self: flex-end;
}

.chat-msg.bot {
  align-self: flex-start;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  line-height: 1.5;
}

.chat-msg.user .msg-bubble {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #050311;
  font-weight: 500;
  border-bottom-right-radius: 4px;
}

.chat-msg.bot .msg-bubble {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom-left-radius: 4px;
}

@keyframes msgSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Chat Footer */
.chat-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.chat-foot input {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 14px;
  color: #fff;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.chat-foot input:focus {
  border-color: rgba(0, 242, 254, 0.3);
}

.chat-foot input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.chat-send {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border: none;
  color: #050311;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.chat-send svg {
  width: 16px;
  height: 16px;
}

.chat-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .chat-panel {
    width: calc(100vw - 20px);
    bottom: 10px;
    right: 10px;
    max-height: 80vh;
    border-radius: 20px;
  }

  .chat-fab {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
}

```

## src/components/Chatbot/Chatbot.jsx

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

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
      setTimeout(() => {
        if (local) {
          setMessages((prev) => [...prev, { from: 'bot', text: local }]);
        } else {
          setMessages((prev) => [...prev, { from: 'bot', text: 'I am not sure about that. Please ask me about our courses, instructors, certificates, pricing, community, or anything related to Solution Adda!' }]);
        }
        setLoading(false);
      }, 600); // Add a small delay for typing effect
      return;
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
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                className={`chat-msg ${m.from}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="msg-bubble">{m.text}</div>
              </motion.div>
            ))}
            {loading && (
              <motion.div 
                className="chat-msg bot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="msg-bubble">
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
          <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
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

```

## src/components/Footer/Footer.css

```css
/* ═══════════════════════════════════════
   PREMIUM FOOTER
   ═══════════════════════════════════════ */

.footer {
  position: relative;
  background: #050311;
  padding-top: 0;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

.footer-gradient-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 242, 254, 0.3), rgba(252, 0, 255, 0.3), transparent);
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 5% 40px;
  position: relative;
}

.footer-brand h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.footer-logo-icon {
  font-size: 1.4rem;
}

.footer-logo-text {
  background: linear-gradient(90deg, #00f2fe, #4facfe, #fc00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-brand > p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 300px;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon:hover {
  background: rgba(0, 242, 254, 0.1);
  border-color: rgba(0, 242, 254, 0.3);
  color: #00f2fe;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.15);
}

.footer-links h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}

.footer-links ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.88rem;
  transition: all 0.25s ease;
  text-decoration: none;
}

.footer-links a:hover {
  color: #00f2fe;
  transform: translateX(4px);
  display: inline-block;
}

/* Newsletter */
.footer-newsletter h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}

.footer-newsletter > p {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.newsletter-form {
  display: flex;
  gap: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.3s ease;
}

.newsletter-form:focus-within {
  border-color: rgba(0, 242, 254, 0.3);
}

.newsletter-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 14px;
  color: #fff;
  font-size: 0.85rem;
  outline: none;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.newsletter-btn {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border: none;
  padding: 0 14px;
  cursor: pointer;
  color: #050311;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.newsletter-btn:hover {
  background: linear-gradient(135deg, #4facfe, #fc00ff);
  color: #fff;
}

/* Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.8rem;
}

.back-to-top {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background: rgba(0, 242, 254, 0.1);
  border-color: rgba(0, 242, 254, 0.3);
  color: #00f2fe;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 900px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 40px 5% 28px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

```

## src/components/Footer/Footer.jsx

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-gradient-line" />

      <div className="footer-content">
        <div className="footer-brand">
          <h3>
            <span className="footer-logo-icon">🎓</span>
            <span className="footer-logo-text">Solution Adda</span>
          </h3>
          <p>Empowering the next generation of tech leaders through expert-led courses and hands-on learning.</p>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/auth">Sign-in / Sign-up</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/">Blog</Link></li>
            <li><Link to="/">Documentation</Link></li>
            <li><Link to="/">Community</Link></li>
            <li><Link to="/">Support</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Get the latest courses and updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button className="newsletter-btn" aria-label="Subscribe">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Solution Adda. All rights reserved.</p>
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      </div>
    </footer>
  );
}

export default Footer;

```

## src/components/Navbar/Navbar.css

```css
/* ═══════════════════════════════════════
   PREMIUM GLASS NAVBAR
   ═══════════════════════════════════════ */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  height: 72px;
  background: rgba(5, 3, 17, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.navbar-scrolled {
  background: rgba(5, 3, 17, 0.9);
  backdrop-filter: blur(30px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

/* Logo */
.navbar-logo {
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  z-index: 2;
}

.logo-icon {
  font-size: 1.6rem;
  filter: drop-shadow(0 0 8px rgba(0, 242, 254, 0.3));
}

.logo-text {
  background: linear-gradient(90deg, #00f2fe, #4facfe, #fc00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

/* Nav Links */
.navbar-links {
  display: flex;
  list-style: none;
  gap: 8px;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-link {
  position: relative;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.04);
}

.nav-link.active {
  color: #fff;
}

.nav-active-indicator {
  position: absolute;
  bottom: -1px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.4);
}

/* Action Buttons */
.navbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 2;
}

.btn-login {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  padding: 9px 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-login:hover {
  color: #00f2fe;
  border-color: rgba(0, 242, 254, 0.35);
  background: rgba(0, 242, 254, 0.05);
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.08);
}

.btn-signup {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #050311;
  padding: 9px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: inherit;
  box-shadow: 0 2px 12px rgba(0, 242, 254, 0.25);
}

.btn-signup:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
}

/* Profile Menu */
.profile-menu-wrapper {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 6px 12px 6px 6px;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
  font-family: inherit;
}

.profile-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: #050311;
}

.profile-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.profile-chevron {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.4);
}

.profile-chevron.open {
  transform: rotate(180deg);
}

/* Dropdown */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: rgba(15, 12, 35, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 242, 254, 0.05);
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #050311;
  flex-shrink: 0;
}

.dropdown-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.dropdown-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 4px 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.dropdown-danger:hover {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 2;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: center;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(5, 3, 17, 0.97);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  z-index: 1;
}

.mobile-menu-inner {
  padding: 16px 5%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  display: block;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.25s ease;
  text-decoration: none;
}

.mobile-link:hover, .mobile-link.active {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.mobile-link.active {
  color: #00f2fe;
}

.mobile-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  padding: 0 16px;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  flex-wrap: wrap;
}

.mobile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #050311;
}

.mobile-logout {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  margin-left: auto;
}

.mobile-logout:hover {
  background: rgba(255, 59, 48, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .navbar-actions {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}

```

## src/components/Navbar/Navbar.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* Detect logged-in user from localStorage */
  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('sa_user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  /* Scroll detection for glass intensity */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('sa_user');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const baseNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' },
  ];

  const navLinks = user && user.role === 'admin' 
    ? [...baseNavLinks, { path: '/admin', label: 'Dashboard' }] 
    : baseNavLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <span className="logo-icon">🎓</span>
        <span className="logo-text">Solution Adda</span>
      </Link>

      {/* Desktop Nav Links */}
      <ul className="navbar-links">
        {navLinks.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div
                  className="nav-active-indicator"
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="navbar-actions">
        {user ? (
          <div className="profile-menu-wrapper">
            <button
              className="profile-trigger"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
            >
              <div className="profile-avatar">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="profile-name">{user.name?.split(' ')[0]}</span>
              <svg className={`profile-chevron ${profileOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                      Dashboard
                    </Link>
                  )}
                  <button className="dropdown-item dropdown-danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate('/auth', { state: { isLogin: true } })}>
              Sign In
            </button>
            <button className="btn-signup" onClick={() => navigate('/auth', { state: { isLogin: false } })}>
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <div className="mobile-menu-inner">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="mobile-actions">
                  <button className="btn-login" onClick={() => { navigate('/auth', { state: { isLogin: true } }); setMenuOpen(false); }}>
                    Sign In
                  </button>
                  <button className="btn-signup" onClick={() => { navigate('/auth', { state: { isLogin: false } }); setMenuOpen(false); }}>
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="mobile-user-info">
                  <div className="mobile-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  )}
                  <button className="mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

```

## src/components/ui/AnimatedBackground.css

```css
.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #050311;
}

/* Aurora gradient orbs */
.aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
}

.aurora-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #00f2fe, transparent 70%);
  top: -15%;
  right: -10%;
  animation: auroraFloat1 16s ease-in-out infinite;
}

.aurora-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #fc00ff, transparent 70%);
  bottom: -10%;
  left: -5%;
  animation: auroraFloat2 20s ease-in-out infinite;
}

.aurora-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #4facfe, transparent 70%);
  top: 40%;
  left: 30%;
  animation: auroraFloat3 18s ease-in-out infinite;
}

/* Subtle mesh grid overlay */
.mesh-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.5;
}

/* Floating particles */
.particles-container {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 242, 254, 0.6);
  animation: particleFloat 8s ease-in-out infinite;
}

/* Aurora variant - more vibrant */
.animated-bg-hero .aurora-1 { opacity: 0.3; }
.animated-bg-hero .aurora-2 { opacity: 0.25; }

/* Auth variant - centered glow */
.animated-bg-auth .aurora-1 {
  top: 20%;
  right: 20%;
  width: 400px;
  height: 400px;
}

.animated-bg-auth .aurora-2 {
  bottom: 20%;
  left: 20%;
  width: 350px;
  height: 350px;
}

/* Subtle variant */
.animated-bg-subtle .aurora-orb {
  opacity: 0.1;
}

@keyframes auroraFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.1); }
  66% { transform: translate(30px, -20px) scale(0.95); }
}

@keyframes auroraFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -40px) scale(1.05); }
  66% { transform: translate(-30px, 20px) scale(0.9); }
}

@keyframes auroraFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -30px) scale(1.08); }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) translateX(0); opacity: var(--opacity, 0.2); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(-15px); opacity: calc(var(--opacity, 0.2) * 1.5); }
  75% { transform: translateY(-25px) translateX(5px); }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-orb,
  .particle {
    animation: none !important;
  }
}

```

## src/components/ui/AnimatedBackground.jsx

```jsx
import React from 'react';
import './AnimatedBackground.css';

/* Reusable animated mesh/aurora background with floating particles */
function AnimatedBackground({ variant = 'default', className = '' }) {
  return (
    <div className={`animated-bg animated-bg-${variant} ${className}`}>
      <div className="aurora-orb aurora-1" />
      <div className="aurora-orb aurora-2" />
      <div className="aurora-orb aurora-3" />
      <div className="mesh-grid" />
      {/* Floating particles */}
      <div className="particles-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              opacity: 0.15 + Math.random() * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AnimatedBackground;

```

## src/components/ui/Badge.css

```css
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  text-transform: capitalize;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.badge-size-xs { padding: 2px 8px; font-size: 0.65rem; }
.badge-size-sm { padding: 4px 12px; font-size: 0.75rem; }
.badge-size-md { padding: 6px 16px; font-size: 0.85rem; }

.badge-info {
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  border: 1px solid rgba(0, 242, 254, 0.2);
}

.badge-success {
  background: rgba(39, 201, 63, 0.1);
  color: #27c93f;
  border: 1px solid rgba(39, 201, 63, 0.2);
}

.badge-warning {
  background: rgba(255, 189, 46, 0.1);
  color: #ffbd2e;
  border: 1px solid rgba(255, 189, 46, 0.2);
}

.badge-danger {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.badge-admin {
  background: rgba(252, 0, 255, 0.1);
  color: #fc00ff;
  border: 1px solid rgba(252, 0, 255, 0.2);
}

.badge-user {
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  border: 1px solid rgba(0, 242, 254, 0.15);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

```

## src/components/ui/Badge.jsx

```jsx
import React from 'react';
import './Badge.css';

/* Status badge: success, warning, info, admin, user, danger */
function Badge({ children, variant = 'info', size = 'sm', dot = false }) {
  return (
    <span className={`premium-badge badge-${variant} badge-size-${size}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export default Badge;

```

## src/components/ui/Button.css

```css
.premium-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  white-space: nowrap;
  user-select: none;
}

.premium-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Sizes */
.btn-size-sm { padding: 8px 16px; font-size: 0.8rem; border-radius: 10px; }
.btn-size-md { padding: 12px 24px; font-size: 0.9rem; }
.btn-size-lg { padding: 14px 32px; font-size: 1rem; border-radius: 14px; }

/* Primary - Gradient */
.btn-primary {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #050311;
  box-shadow: 0 4px 20px rgba(0, 242, 254, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 242, 254, 0.45);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

/* Secondary - Glass */
.btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 242, 254, 0.3);
  color: #00f2fe;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* Danger */
.btn-danger {
  background: rgba(255, 59, 48, 0.12);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(255, 59, 48, 0.2);
  border-color: rgba(255, 59, 48, 0.4);
  transform: translateY(-2px);
}

/* Loading */
.btn-loading .btn-text { opacity: 0.5; }

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: btnSpin 0.6s linear infinite;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  font-size: 1.1em;
}

@keyframes btnSpin {
  to { transform: rotate(360deg); }
}

```

## src/components/ui/Button.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useMagneticHover } from '../../utils/useMagneticHover';
import './Button.css';

/* Premium button with variants: primary (gradient), secondary (glass), ghost, danger */
function Button({ children, variant = 'primary', size = 'md', icon, loading, disabled, onClick, className = '', type = 'button', magnetic, ...props }) {
  const isMagnetic = magnetic !== undefined ? magnetic : (variant === 'primary');
  const { ref, x, y } = useMagneticHover(0.3);

  const ButtonComponent = isMagnetic ? motion.button : 'button';
  const magneticProps = isMagnetic ? { ref, style: { x, y } } : {};

  return (
    <ButtonComponent
      type={type}
      className={`premium-btn btn-${variant} btn-size-${size} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...magneticProps}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </ButtonComponent>
  );
}

export default Button;

```

## src/components/ui/CommandPalette.css

```css
.command-palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(5, 3, 17, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 99999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.command-palette-modal {
  width: 100%;
  max-width: 600px;
  background: rgba(20, 15, 40, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 242, 254, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.command-search-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.search-icon {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
  margin-right: 12px;
}

.command-search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  outline: none;
  font-family: var(--font-family);
}

.command-search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.esc-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.command-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
}

.command-results::-webkit-scrollbar {
  width: 6px;
}

.command-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.command-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
}

.command-item.selected {
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
}

.command-item-icon {
  font-size: 1.2rem;
  margin-right: 16px;
}

.command-item-title {
  flex: 1;
  font-weight: 500;
  font-size: 0.95rem;
}

.command-item-shortcut {
  font-size: 1.1rem;
  opacity: 0.5;
}

.command-empty {
  padding: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.95rem;
}

.command-footer {
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: flex-end;
}

.command-footer kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0 2px;
  font-family: var(--font-mono);
}

```

## src/components/ui/CommandPalette.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import './CommandPalette.css';

const COMMANDS = [
  { id: 'home', title: 'Go to Home', route: '/', icon: '🏠' },
  { id: 'courses', title: 'Explore Courses', route: '/courses', icon: '📚' },
  { id: 'about', title: 'About Us', route: '/about', icon: 'ℹ️' },
  { id: 'auth', title: 'Sign In / Sign Up', route: '/auth', icon: '🔐' },
  { id: 'admin', title: 'Admin Dashboard', route: '/admin', icon: '⚙️', adminOnly: true },
  { id: 'theme', title: 'Toggle Theme (Coming Soon)', action: 'theme', icon: '🌓' },
];

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const user = JSON.parse(localStorage.getItem('sa_user') || 'null');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter((cmd) => {
    if (cmd.adminOnly && (!user || user.role !== 'admin')) return false;
    return cmd.title.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleExecute = (cmd) => {
    setIsOpen(false);
    if (cmd.route) {
      navigate(cmd.route);
    } else if (cmd.action === 'theme') {
      addToast('Theme toggling will be available soon!', 'info');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleExecute(filteredCommands[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="command-palette-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-search-header">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search courses, navigate, or run commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="command-search-input"
              />
              <span className="esc-hint">ESC</span>
            </div>

            <div className="command-results">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    className={`command-item ${selectedIndex === idx ? 'selected' : ''}`}
                    onClick={() => handleExecute(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="command-item-icon">{cmd.icon}</span>
                    <span className="command-item-title">{cmd.title}</span>
                    <span className="command-item-shortcut">
                      {idx === selectedIndex ? '↵' : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="command-empty">No results found for "{search}"</div>
              )}
            </div>
            
            <div className="command-footer">
              <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>↵</kbd> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;

```

## src/components/ui/EmptyState.css

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px;
  min-height: 300px;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: emptyFloat 3s ease-in-out infinite;
  filter: grayscale(0.3);
}

.empty-state-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.empty-state-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.45);
  max-width: 400px;
  line-height: 1.5;
  margin-bottom: 24px;
}

.empty-state-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #050311;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.empty-state-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 242, 254, 0.35);
}

@keyframes emptyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

```

## src/components/ui/EmptyState.jsx

```jsx
import React from 'react';
import './EmptyState.css';

/* Beautiful empty state with icon, title, description, and optional CTA */
function EmptyState({ icon = '🔍', title = 'Nothing here yet', description = '', actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && (
        <button className="empty-state-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

```

## src/components/ui/GlassCard.css

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.glass-hover:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 242, 254, 0.25);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 242, 254, 0.08);
}

.glass-hover:hover::before {
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.4), rgba(252, 0, 255, 0.4));
}

.glass-glow {
  box-shadow: 0 0 40px rgba(0, 242, 254, 0.1), 0 15px 35px rgba(0, 0, 0, 0.2);
}

.glass-glow::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(0, 242, 254, 0.06), transparent 70%);
  pointer-events: none;
  animation: glassGlowPulse 4s ease-in-out infinite;
}

@keyframes glassGlowPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

```

## src/components/ui/GlassCard.jsx

```jsx
import React from 'react';
import './GlassCard.css';

/* Premium glassmorphism card with optional glow, hover tilt, and animated border */
function GlassCard({ children, className = '', glow = false, hover = true, onClick, style }) {
  return (
    <div
      className={`glass-card ${glow ? 'glass-glow' : ''} ${hover ? 'glass-hover' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

export default GlassCard;

```

## src/components/ui/InteractiveBackground.jsx

```jsx
import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function InteractiveBackground() {
  // Use springs directly for normalized coordinates (-1 to 1)
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    // Disable on mobile completely for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      // Normalize between -1 and 1
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, [-1, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [-1, 1], [-15, 15]);

  const gridX = useTransform(mouseX, [-1, 1], [-40, 40]);
  const gridY = useTransform(mouseY, [-1, 1], [-40, 40]);

  const orb1X = useTransform(mouseX, [-1, 1], [-80, 80]);
  const orb1Y = useTransform(mouseY, [-1, 1], [-80, 80]);

  const orb2X = useTransform(mouseX, [-1, 1], [100, -100]);
  const orb2Y = useTransform(mouseY, [-1, 1], [100, -100]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none overflow-hidden">
      <motion.div 
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative w-[120vw] h-[120vh] [transform-style:preserve-3d] will-change-transform"
          style={{ rotateX, rotateY }}
        >
          {/* Deepest Layer - Perspective Grid */}
          <motion.div 
            className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] will-change-transform bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
            style={{ x: gridX, y: gridY, z: -200 }}
          />

          {/* Middle Layer - Cyan Orb */}
          <motion.div 
            className="absolute rounded-full blur-[100px] will-change-transform opacity-40 w-[50vw] h-[50vw] top-[10%] left-[10%] bg-[radial-gradient(circle,rgba(0,242,254,0.3)_0%,transparent_60%)]"
            style={{ x: orb1X, y: orb1Y, z: -50 }}
          />

          {/* Front Layer - Magenta Orb */}
          <motion.div 
            className="absolute rounded-full blur-[100px] will-change-transform opacity-40 w-[60vw] h-[60vw] -bottom-[10%] -right-[10%] bg-[radial-gradient(circle,rgba(252,0,255,0.25)_0%,transparent_60%)]"
            style={{ x: orb2X, y: orb2Y, z: 100 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default InteractiveBackground;

```

## src/components/ui/Modal.css

```css
.premium-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 3, 17, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.premium-modal-content {
  background: linear-gradient(135deg, rgba(20, 15, 50, 0.95), rgba(10, 8, 30, 0.98));
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 28px;
  width: 100%;
  padding: 40px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 242, 254, 0.15);
  max-height: 85vh;
  overflow-y: auto;
}

.premium-modal-content::-webkit-scrollbar {
  width: 4px;
}

.premium-modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.premium-modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.premium-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.25s ease;
  z-index: 1;
}

.premium-modal-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: rotate(90deg);
}

@media (max-width: 600px) {
  .premium-modal-content {
    padding: 28px 20px;
    border-radius: 20px;
    max-height: 90vh;
  }
}

```

## src/components/ui/Modal.jsx

```jsx
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

/* Premium glassmorphic modal with framer-motion animations */
function Modal({ isOpen, onClose, children, maxWidth = '520px', className = '' }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="premium-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={`premium-modal-content ${className}`}
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="premium-modal-close" onClick={onClose} aria-label="Close modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;

```

## src/components/ui/SectionReveal.jsx

```jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* Scroll-triggered reveal wrapper with configurable animation */
function SectionReveal({ children, direction = 'up', delay = 0, className = '', stagger = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };

  const containerVariants = stagger ? {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  } : {};

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger ? containerVariants : variants[direction]}
      transition={stagger ? undefined : {
        duration: 0.7,
        delay,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* Child item for staggered animations */
export function RevealItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default SectionReveal;

```

## src/components/ui/SkeletonLoader.css

```css
.skeleton-loader {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s ease-in-out infinite;
}

@keyframes skeletonShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

```

## src/components/ui/SkeletonLoader.jsx

```jsx
import React from 'react';
import './SkeletonLoader.css';

/* Shimmer loading placeholder */
function SkeletonLoader({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export default SkeletonLoader;

```

## src/components/ui/StatCard.css

```css
.stat-card-premium {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.stat-card-premium:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 242, 254, 0.2);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 242, 254, 0.06);
}

.stat-card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.stat-card-label {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}

.stat-card-trend {
  font-size: 0.75rem;
  font-weight: 600;
}

.trend-up { color: #27c93f; }
.trend-down { color: #ff3b30; }

.stat-card-sparkline {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 30px;
  color: rgba(0, 242, 254, 0.4);
  pointer-events: none;
}

.stat-card-sparkline svg {
  width: 100%;
  height: 100%;
}

```

## src/components/ui/StatCard.jsx

```jsx
import React, { useState, useEffect } from 'react';
import './StatCard.css';

/* Animated counter hook */
function useCounter(end, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end <= 0) return;
    let start = 0;
    const increment = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, duration / 40);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

/* Premium statistics card with animated counter, icon, trend, mini sparkline */
function StatCard({ icon, label, value, suffix = '', trend, trendValue, gradient = 'cyan', className = '' }) {
  const animatedValue = useCounter(typeof value === 'number' ? value : 0);
  const displayValue = typeof value === 'number' ? animatedValue.toLocaleString() : value;

  const gradientMap = {
    cyan: 'linear-gradient(135deg, rgba(0,242,254,0.15), rgba(79,172,254,0.15))',
    magenta: 'linear-gradient(135deg, rgba(252,0,255,0.15), rgba(79,172,254,0.15))',
    green: 'linear-gradient(135deg, rgba(39,201,63,0.15), rgba(0,242,254,0.15))',
    orange: 'linear-gradient(135deg, rgba(255,189,46,0.15), rgba(252,0,255,0.15))',
    blue: 'linear-gradient(135deg, rgba(79,172,254,0.15), rgba(0,242,254,0.15))',
  };

  return (
    <div className={`stat-card-premium ${className}`}>
      <div className="stat-card-icon" style={{ background: gradientMap[gradient] || gradientMap.cyan }}>
        <span>{icon}</span>
      </div>
      <div className="stat-card-info">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{displayValue}{suffix}</span>
        {trend && (
          <span className={`stat-card-trend trend-${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      {/* Mini sparkline decoration */}
      <div className="stat-card-sparkline">
        <svg viewBox="0 0 80 30" preserveAspectRatio="none">
          <polyline
            points="0,25 10,20 20,22 30,15 40,18 50,10 60,12 70,5 80,8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
}

export default StatCard;

```

## src/components/ui/Tooltip.css

```css
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-box {
  position: absolute;
  background: rgba(20, 18, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.tooltip-top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

@keyframes tooltipFadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

```

## src/components/ui/Tooltip.jsx

```jsx
import React, { useState } from 'react';
import './Tooltip.css';

/* Hover tooltip with smooth fade */
function Tooltip({ children, text, position = 'top' }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`tooltip-box tooltip-${position}`}>
          {text}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}

export default Tooltip;

```

## src/contexts/ThemeContext.jsx

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sa_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('sa_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;

```

## src/contexts/Toast.css

```css
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(10, 10, 20, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-family);
  font-size: 0.95rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  min-width: 300px;
  max-width: 400px;
}

.toast-success {
  border-left: 4px solid var(--color-accent-green);
}

.toast-error {
  border-left: 4px solid var(--color-accent-red);
}

.toast-info {
  border-left: 4px solid var(--color-accent-cyan);
}

.toast-warning {
  border-left: 4px solid var(--color-accent-yellow);
}

.toast-icon {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toast-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

```

## src/contexts/ToastContext.jsx

```jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`toast toast-${toast.type}`}
            >
              <span className="toast-icon">
                {toast.type === 'success' && '✅'}
                {toast.type === 'error' && '❌'}
                {toast.type === 'info' && 'ℹ️'}
                {toast.type === 'warning' && '⚠️'}
              </span>
              <span className="toast-message">{toast.message}</span>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

```

## src/coursesData.jsx

```jsx
export const coursesData = [
  {
    title: "Web Development",
    description: "Build beautiful responsive websites and dynamic web applications using modern web technologies.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    emoji: "💻",
    syllabus: [
      "HTML5, CSS3, Flexbox & Grid Layouts",
      "Modern JavaScript (ES6+ Features)",
      "React JS (Hooks, Context API, Router)",
      "Node.js & Express RESTful APIs",
      "MongoDB & Mongoose Databases",
      "Git, GitHub & Cloud Deployment",
    ],
  },
  {
    title: "Data Science",
    description: "Analyze, visualize, and extract valuable insights from complex data structures using python.",
    duration: "8 Months",
    level: "Intermediate",
    emoji: "📊",
    syllabus: [
      "Python programming fundamentals",
      "Data Manipulation with Pandas & NumPy",
      "Data Visualization with Matplotlib & Seaborn",
      "SQL databases and data warehousing",
      "Applied Statistics & Probability",
      "Intro to Machine Learning Models",
    ],
  },
  {
    title: "Machine Learning",
    description: "Master algorithms that learn from data and make predictions using industrial ML toolkits.",
    duration: "6 Months",
    level: "Advanced",
    emoji: "🤖",
    syllabus: [
      "Supervised vs Unsupervised Learning",
      "Regression, Decision Trees & Random Forests",
      "Feature Engineering & Dimensionality Reduction",
      "TensorFlow and PyTorch basics",
      "Model Evaluation & Hyperparameter Tuning",
      "Deploying ML Models as Web APIs",
    ],
  },
  {
    title: "Deep Learning",
    description: "Dive deep into artificial neural networks, computer vision, and speech processing technologies.",
    duration: "5 Months",
    level: "Advanced",
    emoji: "🧠",
    syllabus: [
      "Multi-Layer Perceptrons & Backpropagation",
      "Convolutional Neural Networks (CNNs) for Images",
      "Recurrent Neural Networks (RNNs) & LSTMs",
      "Generative Adversarial Networks (GANs)",
      "PyTorch framework development",
      "Transfer Learning & Model Fine-tuning",
    ],
  },
  {
    title: "Cyber Security",
    description: "Secure digital assets, perform ethical hacking, and protect networks from cyber threats.",
    duration: "6 Months",
    level: "Intermediate",
    emoji: "🔒",
    syllabus: [
      "Networking Protocols & Cyber Security Foundations",
      "Ethical Hacking & Penetration Testing",
      "Cryptography, SSL/TLS, and PKI",
      "Linux Administration & Bash Scripting",
      "Web Application Hacking Techniques",
      "Incident Response & Vulnerability Assessment",
    ],
  },
  {
    title: "Cloud Computing",
    description: "Deploy, manage, and scale server infrastructure on AWS, Azure, and Google Cloud Platform.",
    duration: "4 Months",
    level: "Intermediate",
    emoji: "☁️",
    syllabus: [
      "Cloud Infrastructure Basics & Models",
      "AWS Core Services (EC2, S3, RDS, IAM)",
      "Containerization using Docker",
      "Container Orchestration with Kubernetes",
      "Serverless computing & Microservices",
      "Cloud Security & Compliance best practices",
    ],
  },
  {
    title: "Mobile App Development",
    description: "Build high-performance, cross-platform Android and iOS applications with single codebase.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    emoji: "📱",
    syllabus: [
      "JavaScript/Dart Fundamentals",
      "React Native or Flutter Frameworks",
      "Mobile UI Design & Gesture Handlers",
      "State Management (Redux/Provider)",
      "Integrating APIs & Native Device Features",
      "App Store & Google Play Publishing",
    ],
  },
  {
    title: "Database Management",
    description: "Design and implement relational and non-relational database storage systems for high throughput.",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    emoji: "🗄️",
    syllabus: [
      "Relational Database Design & Schema Creation",
      "Structured Query Language (SQL) Advanced Queries",
      "NoSQL Databases (MongoDB, Cassandra)",
      "Database Indexing & Performance Tuning",
      "Transactions, ACID Properties, and Concurrency",
      "Backup, Recovery, and Replication Strategies",
    ],
  },
  {
    title: "Networking",
    description: "Configure switches, routers, and secure networks for large enterprises and setups.",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    emoji: "🌐",
    syllabus: [
      "TCP/IP and OSI Networking Reference Models",
      "IP Addressing, Subnetting, and Routing Concepts",
      "Switching Basics, VLANs, and Spanning Tree Protocol",
      "Routing Protocols (OSPF, BGP, RIP)",
      "Network Address Translation (NAT) & Firewalls",
      "Introduction to CCNA standards & certification",
    ],
  },
  {
    title: "Software Engineering",
    description: "Learn methodologies, architecture design patterns, and engineering practices used in tech industries.",
    duration: "5 Months",
    level: "Intermediate",
    emoji: "⚙️",
    syllabus: [
      "Software Development Lifecycle (SDLC) & Agile",
      "System Architecture & Object-Oriented Design",
      "Design Patterns (Singleton, Factory, MVC)",
      "Unit Testing, Integration Testing, and TDD",
      "CI/CD Pipelines & Version Control (Git)",
      "Code Refactoring & Technical Debt Management",
    ],
  },
  {
    title: "Artificial Intelligence",
    description: "Understand Natural Language Processing, computer vision, and build Large Language Model applications.",
    duration: "8 Months",
    level: "Advanced",
    emoji: "🔮",
    syllabus: [
      "Introduction to AI & Search Algorithms",
      "Natural Language Processing (NLP) foundations",
      "Computer Vision & Object Detection",
      "Large Language Models (LLMs) & Prompts",
      "LangChain & Vector Databases (Pinecone, Chroma)",
      "AI Ethics, Bias, and Future Technologies",
    ],
  },
  {
    title: "Blockchain Development",
    description: "Code smart contracts, develop decentralized applications (DApps), and understand cryptography.",
    duration: "5 Months",
    level: "Advanced",
    emoji: "⛓️",
    syllabus: [
      "Blockchain Cryptography & Distributed Ledgers",
      "Ethereum, Solidity Smart Contract Syntax",
      "Web3.js & Ethers.js frontend integration",
      "Decentralized Application (DApp) development",
      "Tokens (ERC-20, ERC-721 NFTs) & DeFi Basics",
      "Smart Contract Auditing & Security Vulnerabilities",
    ],
  },
  {
    title: "DevOps",
    description: "Automate build deployments, manage server configurations, and setup monitoring systems.",
    duration: "4 Months",
    level: "Intermediate",
    emoji: "🚀",
    syllabus: [
      "DevOps Culture & Agile Operations",
      "Continuous Integration & Deployment (Jenkins, Actions)",
      "Infrastructure as Code (IaC) with Terraform",
      "Configuration Management using Ansible",
      "Server Monitoring (Prometheus, Grafana)",
      "Log aggregation and analytics (ELK Stack)",
    ],
  },
  {
    title: "Python Programming",
    description: "Learn the most popular language for scripting, automation, web applications, and analytics.",
    duration: "3 Months",
    level: "Beginner to Advanced",
    emoji: "🐍",
    syllabus: [
      "Python Basics: Variables, Loops, and Functions",
      "Object-Oriented Programming (OOP) in Python",
      "File I/O, Error Handling, and Libraries",
      "Interacting with Web APIs and JSON",
      "Automation scripts & web scraping with BeautifulSoup",
      "Writing Clean Code (PEP 8 Standards)",
    ],
  },
  {
    title: "Java Development",
    description: "Develop enterprise-scale backend web services using Java and Spring Boot framework.",
    duration: "6 Months",
    level: "Intermediate",
    emoji: "☕",
    syllabus: [
      "Java Language syntax, OOP, and Collections",
      "Multi-threading & Exception Handling",
      "Spring Boot Framework & Spring MVC",
      "Spring Data JPA & Hibernate ORM mapping",
      "Microservices Architecture & REST API Security",
      "Testing with JUnit and Mockito",
    ],
  },
  {
    title: "C & C++ Programming",
    description: "Understand low-level memory layout, pointers, and high-performance programming techniques.",
    duration: "4 Months",
    level: "Beginner to Advanced",
    emoji: "👾",
    syllabus: [
      "Basic syntax, Control structures & Functions",
      "Pointers, References, and Memory Management",
      "Object-Oriented Programming in C++",
      "Standard Template Library (STL) Containers",
      "Basic Data Structures (Stacks, Queues, Trees)",
      "Algorithms (Sorting, Binary Search, Big-O)",
    ],
  },
];

```

## src/index.css

```css
/* ═══════════════════════════════════════════════════════
   SOLUTIONS ADDA — Premium Design System
   Apple × Linear × Vercel × Stripe inspired
   ═══════════════════════════════════════════════════════ */

@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ─── Design Tokens ─── */
:root {
  /* Colors - Dark Theme */
  --color-bg-primary: #050311;
  --color-bg-secondary: #0a0a1a;
  --color-bg-tertiary: #0d0b1e;
  --color-bg-elevated: #12102a;

  --color-surface: rgba(255, 255, 255, 0.03);
  --color-surface-hover: rgba(255, 255, 255, 0.06);
  --color-surface-active: rgba(255, 255, 255, 0.08);

  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.15);
  --color-border-active: rgba(0, 242, 254, 0.3);

  --color-accent-cyan: #00f2fe;
  --color-accent-blue: #4facfe;
  --color-accent-magenta: #fc00ff;
  --color-accent-green: #27c93f;
  --color-accent-yellow: #ffbd2e;
  --color-accent-red: #ff3b30;

  --color-text-primary: #ffffff;
  --color-text-secondary: #b0aec6;
  --color-text-muted: rgba(255, 255, 255, 0.4);
  --color-text-faint: rgba(255, 255, 255, 0.25);

  --gradient-primary: linear-gradient(135deg, #00f2fe, #4facfe);
  --gradient-accent: linear-gradient(135deg, #4facfe, #fc00ff);
  --gradient-surface: linear-gradient(135deg, rgba(20, 15, 50, 0.6), rgba(10, 8, 30, 0.6));
  --gradient-text: linear-gradient(90deg, #00f2fe, #4facfe, #fc00ff);

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;

  --fs-xs: 0.75rem;
  --fs-sm: 0.85rem;
  --fs-base: 0.95rem;
  --fs-md: 1.05rem;
  --fs-lg: 1.25rem;
  --fs-xl: 1.5rem;
  --fs-2xl: 2rem;
  --fs-3xl: 2.6rem;
  --fs-4xl: 3.5rem;
  --fs-5xl: 4.5rem;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 8px 25px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 25px 60px rgba(0, 0, 0, 0.4);
  --shadow-glow-cyan: 0 0 30px rgba(0, 242, 254, 0.15);
  --shadow-glow-magenta: 0 0 30px rgba(252, 0, 255, 0.15);

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-blur: blur(20px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);

  /* Transitions */
  --ease-smooth: cubic-bezier(0.25, 0.8, 0.25, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 0.2s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;

  /* Layout */
  --navbar-height: 72px;
  --sidebar-width: 260px;
  --sidebar-collapsed: 72px;
  --max-width: 1400px;
  --content-padding: 8%;
}

/* ─── Global Reset ─── */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-family: var(--font-family);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}


img, video, svg {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

ul, ol {
  list-style: none;
}

/* ─── Custom Scrollbar ─── */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* ─── Focus Ring ─── */
:focus-visible {
  outline: 2px solid var(--color-accent-cyan);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ─── Selection ─── */
::selection {
  background: rgba(0, 242, 254, 0.2);
  color: #fff;
}

/* ─── Utility Classes ─── */
.text-gradient {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
}

/* ─── Reduced Motion ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }
}

/* ─── Global Keyframes ─── */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 242, 254, 0.1); }
  50% { box-shadow: 0 0 40px rgba(0, 242, 254, 0.2); }
}

```

## src/index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

## src/pages/About/About.css

```css
/* ═══ PREMIUM ABOUT PAGE ═══ */

.student-about-dark {
  min-height: calc(100vh - 72px);
  background: #050311;
  color: #fff;
  overflow-x: hidden;
}

/* Hero */
.dark-hero {
  text-align: center;
  padding: 100px 5% 60px;
  position: relative;
}

.dark-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 242, 254, 0.08), transparent 70%);
  pointer-events: none;
}

.project-tag {
  display: inline-block;
  background: rgba(0, 242, 254, 0.06);
  border: 1px solid rgba(0, 242, 254, 0.2);
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #00f2fe;
  margin-bottom: 20px;
  letter-spacing: 0.03em;
}

.hero-main-title {
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -1px;
  line-height: 1.15;
}

.text-gradient {
  background: linear-gradient(90deg, #00f2fe, #4facfe, #fc00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark-hero .hero-subtitle {
  color: rgba(255, 255, 255, 0.45);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Content Sections */
.dark-content-section {
  padding: 60px 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.concept-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px;
  transition: all 0.3s ease;
}

.concept-card:hover {
  border-color: rgba(0, 242, 254, 0.2);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.concept-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
}

.concept-card p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.95rem;
  line-height: 1.7;
}

.concept-card strong {
  color: #00f2fe;
}

/* Section Title */
.section-title-center {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 40px;
  background: linear-gradient(90deg, #00f2fe, #4facfe, #fc00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Features Grid */
.modern-features-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.modern-feature-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 36px 28px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modern-feature-box:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(0, 242, 254, 0.25);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 25px rgba(0, 242, 254, 0.08);
}

.modern-feature-box .feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: inline-flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(252, 0, 255, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.modern-feature-box h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #fff;
}

.modern-feature-box p {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Future Note */
.dark-future-note {
  text-align: center;
  padding: 60px 5% 80px;
  max-width: 600px;
  margin: 0 auto;
}

.dark-future-note h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.dark-future-note p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-main-title {
    font-size: 2.4rem;
  }

  .concept-card {
    padding: 28px 20px;
  }

  .section-title-center {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .hero-main-title {
    font-size: 1.9rem;
  }

  .dark-hero {
    padding: 60px 5% 40px;
  }
}
```

## src/pages/About/About.jsx

```jsx
import React from 'react';
import SectionReveal, { RevealItem } from '../../components/ui/SectionReveal';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import './About.css';

function About() {
  return (
    <div className="student-about-dark">
      <AnimatedBackground variant="subtle" />
      
      {/* Premium Dark Hero Header */}
      <header className="dark-hero">
        <SectionReveal direction="down">
          <span className="project-tag">E-Learning Platform</span>
          <h1 className="hero-main-title">About <span className="text-gradient">Solution Adda</span></h1>
          <p className="hero-subtitle">
            A centralized full-stack learning platform designed to streamline student education and course management.
          </p>
        </SectionReveal>
      </header>

      {/* Core Concept Section */}
      <section className="dark-content-section">
        <SectionReveal direction="up" delay={0.2}>
          <div className="concept-card">
            <h2>The Problem We Are Solving</h2>
            <p>
              In traditional learning, study materials, video links, and assignments are often scattered across different groups and websites. 
              <strong> Solution Adda</strong> solves this challenge by bringing everything into one unified dashboard. 
              Students can explore courses, watch video lessons, and monitor their completion metrics seamlessly.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* Clean Feature Blocks (No Complex Grid/Table) */}
      <section className="dark-content-section">
        <SectionReveal direction="fade">
          <h2 className="section-title-center">Core Pillars of Solution Adda</h2>
        </SectionReveal>
        
        <SectionReveal stagger={true} className="modern-features-container">
          <RevealItem>
            <div className="modern-feature-box">
              <div className="feature-icon">🔍</div>
              <h3>Course Management</h3>
              <p>Easy discovery and structural organization of academic subjects and technical skills in one place.</p>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="modern-feature-box">
              <div className="feature-icon">📺</div>
              <h3>Video Tracking</h3>
              <p>Seamless learning experience with background persistence to save your exact watched time.</p>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="modern-feature-box">
              <div className="feature-icon">📊</div>
              <h3>Dynamic Analytics</h3>
              <p>Real-time calculation of student milestones based on unique lessons completed.</p>
            </div>
          </RevealItem>
        </SectionReveal>
      </section>

      {/* Simple Future Target */}
      <footer className="dark-future-note">
        <SectionReveal direction="up">
          <h3>What's Next?</h3>
          <p>
            We are currently working on adding automated course recommendations and integrated 
            discussion panels to make peer learning easier.
          </p>
        </SectionReveal>
      </footer>
    </div>
  );
}

export default About;
```

## src/pages/About/payment.css

```css
/* Clean Student-Style Dark Palette */
.payment-body {
    background-color: #0f172a; /* Slate 900 */
    color: #f1f5f9;
}

.payment-box {
    background-color: #1e293b; /* Slate 800 */
    border: 1px solid #334155;
}

.input-field {
    background-color: #0f172a;
    border: 1px solid #475569;
    color: #fff;
    padding: 10px 14px;
    border-radius: 8px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
}

.input-field:focus {
    border-color: #3b82f6;
}

.tab-btn {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
}

.tab-btn.active {
    background-color: #3b82f6;
    color: white;
}

.hidden {
    display: none !important;
}
```

## src/pages/About/payment.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Fee Payment</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="payment.css">
</head>
<body class="flex items-center justify-center min-h-screen font-sans payment-body">

    <div class="payment-box p-6 rounded-xl w-full max-w-sm shadow-lg">
        <div class="mb-5 text-center">
            <h2 class="text-xl font-bold">EduLearn Payment</h2>
            <p class="text-xs text-gray-400 mt-1">Amount to pay: <span class="text-blue-400 font-bold text-sm">₹4,999.00</span></p>
        </div>

        <div class="flex gap-2 bg-slate-900 p-1 rounded-lg mb-5">
            <button type="button" id="cardTab" class="tab-btn active flex-1 text-center" onclick="switchMode('card')">Card</button>
            <button type="button" id="upiTab" class="tab-btn flex-1 text-center text-gray-400" onclick="switchMode('upi')">UPI</button>
        </div>

        <form id="payForm" onsubmit="handleFormSubmit(event)">
            
            <div id="cardSection" class="space-y-4">
                <div>
                    <label class="text-xs text-gray-400 block mb-1 font-medium">Cardholder Name</label>
                    <input type="text" id="cName" placeholder="Dishant Sarsar" class="input-field" required>
                </div>
                <div>
                    <label class="text-xs text-gray-400 block mb-1 font-medium">Card Number</label>
                    <input type="text" id="cNum" placeholder="1234 5678 9101 1121" maxlength="19" class="input-field" required>
                </div>
                <div class="flex gap-4">
                    <div class="w-1/2">
                        <label class="text-xs text-gray-400 block mb-1 font-medium">Expiry</label>
                        <input type="text" id="cExp" placeholder="MM/YY" maxlength="5" class="input-field text-center" required>
                    </div>
                    <div class="w-1/2">
                        <label class="text-xs text-gray-400 block mb-1 font-medium">CVV</label>
                        <input type="password" id="cCvv" placeholder="***" maxlength="3" class="input-field text-center" required>
                    </div>
                </div>
            </div>

            <div id="upiSection" class="space-y-4 hidden">
                <div>
                    <label class="text-xs text-gray-400 block mb-1 font-medium">Enter UPI ID</label>
                    <input type="text" id="upiId" placeholder="dishant@apl" class="input-field">
                </div>
                <div class="text-xs text-gray-500 text-center py-2">Or scan QR code on next step</div>
            </div>

            <button type="submit" id="payBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6 transition-all cursor-pointer text-sm">
                Pay Securely
            </button>
        </form>
    </div>

    <script src="payment.js"></script>
</body>
</html>
```

## src/pages/About/payment.jsx

```jsx
let currentMethod = 'card';

// Switch between Card and UPI tabs
function switchMode(mode) {
    currentMethod = mode;
    const cardSec = document.getElementById('cardSection');
    const upiSec = document.getElementById('upiSection');
    const cTab = document.getElementById('cardTab');
    const uTab = document.getElementById('upiTab');

    if (mode === 'card') {
        cardSec.classList.remove('hidden');
        upiSec.classList.add('hidden');
        cTab.classList.add('active', 'text-white');
        uTab.classList.remove('active', 'text-white');
        uTab.classList.add('text-gray-400');
        
        // Form validations dynamic toggle
        document.getElementById('cName').required = true;
        document.getElementById('cNum').required = true;
        document.getElementById('cExp').required = true;
        document.getElementById('cCvv').required = true;
        document.getElementById('upiId').required = false;
    } else {
        upiSec.classList.remove('hidden');
        cardSec.classList.add('hidden');
        uTab.classList.add('active', 'text-white');
        cTab.classList.remove('active', 'text-white');
        cTab.classList.add('text-gray-400');
        
        document.getElementById('cName').required = false;
        document.getElementById('cNum').required = false;
        document.getElementById('cExp').required = false;
        document.getElementById('cCvv').required = false;
        document.getElementById('upiId').required = true;
    }
}

// Automatically add spaces after every 4 digits in card number
document.getElementById('cNum').addEventListener('input', (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted;
});

// Automatically add slash in expiry field (MM/YY)
document.getElementById('cExp').addEventListener('input', (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length > 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
});

// Form submit action
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('payBtn');
    
    btn.disabled = true;
    btn.innerText = 'Processing Payment...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        btn.innerText = 'Payment Successful!';
        btn.style.backgroundColor = '#10b981'; // Green color on success
        alert('Payment Done via ' + currentMethod.toUpperCase());
    }, 2000);
}
```

## src/pages/Admin/Admin.css

```css
/* Premium Admin Dashboard CSS */

.admin-layout {
  display: flex;
  height: 100vh;
  background: #050311;
  color: #fff;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
  position: fixed;
  inset: 0;
  z-index: 9999; /* Overlays over everything if accessed directly */
}

/* Background */
.admin-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.admin-bg .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
}

.admin-bg .orb-1 {
  width: 500px; height: 500px;
  background: #00f2fe;
  top: -200px; right: -200px;
}

.admin-bg .orb-2 {
  width: 400px; height: 400px;
  background: #fc00ff;
  bottom: -150px; left: -150px;
}

/* Sidebar */
.admin-sidebar {
  width: 280px;
  background: rgba(10, 8, 25, 0.85);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 20;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-header h2 {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00f2fe, #fc00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.version-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
}

.sidebar-profile {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-info strong {
  font-size: 0.95rem;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.active {
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 10px;
  color: #ff3b30;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 59, 48, 0.2);
}

/* Main Area */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.admin-topbar {
  height: 70px;
  background: rgba(10, 8, 25, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.topbar-left h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.topbar-right {
  display: flex;
  gap: 16px;
}

.topbar-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.topbar-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notif-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #ff3b30;
  border-radius: 50%;
}

.admin-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

/* Tab Specific Styles */
.admin-tab-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

/* Dashboard Tab */
.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.admin-dashboard-split {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-list li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.activity-details {
  flex: 1;
}

.activity-details p {
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.activity-details span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.action-buttons button {
  width: 100%;
  justify-content: flex-start;
}

/* Users Tab */
.table-responsive {
  overflow-x: auto;
}

.premium-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.premium-table th {
  text-align: left;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.premium-table td {
  background: rgba(255, 255, 255, 0.02);
  padding: 16px;
  font-size: 0.9rem;
}

.premium-table tr td:first-child { border-radius: 12px 0 0 12px; }
.premium-table tr td:last-child { border-radius: 0 12px 12px 0; }

.table-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 700;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Courses Tab */
.admin-courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.admin-course-card {
  padding: 20px;
}

.admin-course-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.course-emoji {
  font-size: 2rem;
}

.course-actions {
  display: flex;
  gap: 6px;
}

.admin-course-card h4 {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.course-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.course-stats {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.c-stat {
  display: flex;
  flex-direction: column;
}

.c-stat span { font-size: 0.7rem; color: rgba(255, 255, 255, 0.4); }
.c-stat strong { font-size: 0.95rem; }

/* Analytics */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card h3 {
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.pure-css-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 30px;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bar-wrap {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 100%;
  max-width: 40px;
  background: linear-gradient(to top, rgba(0, 242, 254, 0.2), #00f2fe);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.bar-wrap span {
  position: absolute;
  bottom: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.area-chart {
  position: relative;
}

.area-chart svg {
  width: 100%;
  height: 100%;
}

.chart-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.chart-labels span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Notifications */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notif-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.notif-item.alert { border-left: 3px solid #ff3b30; }
.notif-item.info { border-left: 3px solid #00f2fe; }
.notif-item.success { border-left: 3px solid #27c93f; }

.notif-icon {
  font-size: 1.5rem;
}

.notif-content h4 {
  font-size: 1rem;
  margin-bottom: 4px;
}

.notif-content p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.notif-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Settings */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.settings-card h3 {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.premium-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 10px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
}

.premium-input:focus {
  outline: none;
  border-color: #00f2fe;
}

/* Toggle Switch */
.toggle-switch {
  width: 50px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-switch.active {
  background: #27c93f;
}

.toggle-knob {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: all 0.3s;
}

.toggle-switch.active .toggle-knob {
  left: 25px;
}

.mt-4 { margin-top: 16px; }

/* Denied State */
.admin-page-denied {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050311;
  padding: 20px;
}

.access-denied-card {
  text-align: center;
  max-width: 400px;
}

.access-denied-card h2 {
  font-size: 2rem;
  margin-bottom: 12px;
  color: #ff3b30;
}

.access-denied-card p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
}

/* Mobile Nav */
.admin-mobile-header {
  display: none;
  height: 60px;
  background: rgba(10, 8, 25, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  z-index: 30;
}

.admin-mobile-header h2 {
  font-size: 1.1rem;
  background: linear-gradient(90deg, #00f2fe, #fc00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Responsiveness */
@media (max-width: 900px) {
  .admin-dashboard-split, .charts-grid, .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-mobile-header {
    display: flex;
  }
  
  .admin-topbar {
    display: none; /* Hide desktop topbar on mobile */
  }

  .admin-sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    top: 60px;
    background: rgba(0,0,0,0.5);
    z-index: 15;
  }
}

```

## src/pages/Admin/Admin.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { coursesData } from '../../coursesData';
import './Admin.css';

// --- Sub-Tab Components ---

const DashboardTab = ({ users }) => {
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="tab-title">Platform Overview</h2>
      <div className="admin-stats-grid">
        <StatCard icon="👥" label="Total Users" value={users.length} gradient="cyan" />
        <StatCard icon="🛡️" label="Admins" value={adminCount} gradient="magenta" />
        <StatCard icon="🎓" label="Students" value={userCount} gradient="blue" />
        <StatCard icon="📚" label="Total Courses" value={coursesData.length} gradient="green" />
      </div>
      
      <div className="admin-dashboard-split">
        <GlassCard className="recent-activity">
          <h3>Recent Registrations</h3>
          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ul className="activity-list">
              {users.slice(-5).reverse().map((u, i) => (
                <li key={i}>
                  <div className="activity-icon">👤</div>
                  <div className="activity-details">
                    <p><strong>{u.name}</strong> joined the platform</p>
                    <span>{u.email}</span>
                  </div>
                  <Badge variant={u.role === 'admin' ? 'admin' : 'user'} size="xs">{u.role}</Badge>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
        
        <GlassCard className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Button variant="secondary" onClick={() => alert('Mock: Create Course Modal opened.')}>+ Create New Course</Button>
            <Button variant="secondary" onClick={() => alert('Mock: Invite Admin Modal opened.')}>+ Invite Admin</Button>
            <Button variant="secondary" onClick={() => alert('Mock: Generate Report initiated.')}>📥 Generate Report</Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const UsersTab = ({ users }) => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="tab-header">
        <h2 className="tab-title">User Management</h2>
        <Button variant="primary" size="sm">+ Add User</Button>
      </div>
      <GlassCard className="table-card">
        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan="5"><EmptyState icon="👥" title="No users yet" description="Wait for users to register." /></td></tr>
              )}
              {users.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><Badge variant={u.role === 'admin' ? 'admin' : 'user'}>{u.role}</Badge></td>
                  <td><Badge variant="success" dot>Active</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit">✏️</button>
                      <button className="action-btn delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const CoursesTab = () => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="tab-header">
        <h2 className="tab-title">Course Catalog</h2>
        <Button variant="primary" size="sm">+ New Course</Button>
      </div>
      <div className="admin-courses-grid">
        {coursesData.map((course, idx) => (
          <GlassCard key={idx} hover={false} className="admin-course-card">
            <div className="admin-course-head">
              <span className="course-emoji">{course.emoji}</span>
              <div className="course-actions">
                <button className="action-btn edit">✏️</button>
                <button className="action-btn delete">🗑️</button>
              </div>
            </div>
            <h4>{course.title}</h4>
            <div className="course-meta">
              <Badge variant="info" size="xs">{course.level}</Badge>
              <span className="text-muted text-xs">{course.duration}</span>
            </div>
            <div className="course-stats">
              <div className="c-stat"><span>Enrolled</span><strong>{Math.floor(Math.random() * 500) + 50}</strong></div>
              <div className="c-stat"><span>Rating</span><strong>4.{Math.floor(Math.random() * 9) + 1} ⭐</strong></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsTab = () => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="tab-title">Platform Analytics</h2>
      <div className="charts-grid">
        <GlassCard className="chart-card">
          <h3>Revenue Overview (Mock)</h3>
          <div className="pure-css-chart">
            <div className="bar-wrap"><div className="bar" style={{ height: '40%' }}></div><span>Jan</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '70%' }}></div><span>Feb</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '50%' }}></div><span>Mar</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '90%' }}></div><span>Apr</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '60%' }}></div><span>May</span></div>
            <div className="bar-wrap"><div className="bar" style={{ height: '85%' }}></div><span>Jun</span></div>
          </div>
        </GlassCard>
        
        <GlassCard className="chart-card">
          <h3>Enrollment Trends</h3>
          <div className="pure-css-chart area-chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 0.5)" />
                <stop offset="100%" stopColor="rgba(0, 242, 254, 0)" />
              </linearGradient>
              <path d="M0,100 L0,60 L20,40 L40,70 L60,30 L80,50 L100,20 L100,100 Z" fill="url(#areaGrad)" />
              <polyline points="0,60 20,40 40,70 60,30 80,50 100,20" fill="none" stroke="#00f2fe" strokeWidth="2" />
            </svg>
            <div className="chart-labels">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const NotificationsTab = () => {
  const mockNotifs = [
    { id: 1, type: 'alert', title: 'High Traffic Alert', desc: 'Server load reached 85% at 14:00 UTC.', time: '2 hours ago' },
    { id: 2, type: 'info', title: 'System Update', desc: 'Version 2.4 deployed successfully.', time: '5 hours ago' },
    { id: 3, type: 'success', title: 'New Revenue Milestone', desc: 'Platform crossed 10k MRR.', time: '1 day ago' },
    { id: 4, type: 'alert', title: 'Failed Login Attempts', desc: 'Multiple failed logins detected for user admin@test.com.', time: '2 days ago' }
  ];

  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="tab-header">
        <h2 className="tab-title">System Notifications</h2>
        <Button variant="ghost" size="sm">Mark all as read</Button>
      </div>
      <GlassCard className="notifications-list">
        {mockNotifs.map(n => (
          <div key={n.id} className={`notif-item ${n.type}`}>
            <div className="notif-icon">
              {n.type === 'alert' && '⚠️'}
              {n.type === 'info' && 'ℹ️'}
              {n.type === 'success' && '🎉'}
            </div>
            <div className="notif-content">
              <h4>{n.title}</h4>
              <p>{n.desc}</p>
              <span className="notif-time">{n.time}</span>
            </div>
          </div>
        ))}
      </GlassCard>
    </motion.div>
  );
};

const SettingsTab = () => {
  return (
    <motion.div className="admin-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="tab-title">Platform Settings</h2>
      <div className="settings-grid">
        <GlassCard className="settings-card">
          <h3>General Settings</h3>
          <div className="form-group">
            <label>Platform Name</label>
            <input type="text" defaultValue="Solution Adda" className="premium-input" />
          </div>
          <div className="form-group">
            <label>Support Email</label>
            <input type="email" defaultValue="support@solutionadda.com" className="premium-input" />
          </div>
          <Button variant="primary">Save Changes</Button>
        </GlassCard>
        
        <GlassCard className="settings-card">
          <h3>Security</h3>
          <div className="form-group">
            <label>Two-Factor Authentication</label>
            <div className="toggle-switch active">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <div className="form-group">
            <label>Require Email Verification</label>
            <div className="toggle-switch">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <Button variant="danger" className="mt-4">Revoke All Sessions</Button>
        </GlassCard>
      </div>
    </motion.div>
  );
};

// --- Main Admin Component ---

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
  const current = JSON.parse(localStorage.getItem('sa_user') || '{}');

  useEffect(() => {
    // Close sidebar on tab change on mobile
    setIsSidebarOpen(false);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('sa_user');
    navigate('/');
  };

  if (!current || current.role !== 'admin') {
    return (
      <div className="admin-page-denied">
        <GlassCard className="access-denied-card" glow>
          <h2>Access Denied</h2>
          <p>You do not have administrative privileges to view this area.</p>
          <Button variant="primary" onClick={() => navigate('/')}>Return to Home</Button>
        </GlassCard>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      {/* Background */}
      <div className="admin-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <h2>Solution Adda Admin</h2>
        <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
      </div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Console</h2>
          <span className="version-badge">v2.0</span>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">{current.name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <strong>{current.name}</strong>
            <Badge variant="admin" size="xs">Administrator</Badge>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-left">
            <h3>{tabs.find(t => t.id === activeTab)?.label}</h3>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon" onClick={() => navigate('/')}>🏠</button>
            <button className="topbar-icon">🔔<span className="notif-dot"></span></button>
          </div>
        </div>
        
        <div className="admin-content-scroll">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardTab key="dashboard" users={users} />}
            {activeTab === 'users' && <UsersTab key="users" users={users} />}
            {activeTab === 'courses' && <CoursesTab key="courses" />}
            {activeTab === 'analytics' && <AnalyticsTab key="analytics" />}
            {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
            {activeTab === 'settings' && <SettingsTab key="settings" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Admin;

```

## src/pages/Auth/Auth.css

```css
/* ═══ PREMIUM AUTH PAGE ═══ */

.auth-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  background: #050311;
}

/* Animated Background */
.auth-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #050311;
}

.auth-bg .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: orbFloat 14s ease-in-out infinite;
}

.auth-bg .orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #00f2fe, transparent 70%);
  top: -10%;
  right: -5%;
}

.auth-bg .orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #fc00ff, transparent 70%);
  bottom: -10%;
  left: -5%;
  animation-delay: -5s;
}

.auth-bg .orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #4facfe, transparent 70%);
  top: 40%;
  left: 40%;
  animation-delay: -8s;
  opacity: 0.15;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -40px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
}

/* Auth Card */
.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 40px 36px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35), 0 0 40px rgba(0, 242, 254, 0.05);
}

/* Toggle */
.auth-toggle {
  display: flex;
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 28px;
}

.toggle-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border-radius: 11px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
}

.toggle-slider.right {
  transform: translateX(100%);
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
  font-family: inherit;
}

.toggle-btn.active {
  color: #050311;
}

/* Auth Header */
.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.auth-greeting {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 6px;
}

.auth-desc {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
}

/* Form Fields */
.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0 14px;
  transition: all 0.3s ease;
}

.field-wrap:focus-within {
  border-color: rgba(0, 242, 254, 0.35);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.08);
}

.field.error .field-wrap {
  border-color: rgba(255, 59, 48, 0.4);
}

.field-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  display: flex;
  margin-right: 10px;
}

.field-icon svg {
  width: 18px;
  height: 18px;
}

.field-wrap input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 13px 0;
  color: #fff;
  font-size: 0.92rem;
  outline: none;
}

.field-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.toggle-pass {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  transition: color 0.2s;
  padding: 0;
}

.toggle-pass svg {
  width: 18px;
  height: 18px;
}

.toggle-pass:hover {
  color: rgba(255, 255, 255, 0.6);
}

.field-err {
  display: block;
  font-size: 0.75rem;
  color: #ff3b30;
  margin-top: 6px;
  padding-left: 2px;
}

/* Role Selection */
.role-wrap {
  gap: 8px;
  padding: 6px;
}

.role-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.45);
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.role-option input {
  display: none;
}

.role-option.active {
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  border-color: rgba(0, 242, 254, 0.25);
}

/* Submit Button */
.submit-auth {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #050311;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 20px rgba(0, 242, 254, 0.3);
  font-family: inherit;
}

.submit-auth:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 242, 254, 0.45);
}

.submit-auth:active {
  transform: translateY(0) scale(0.98);
}

/* Switch Text */
.switch-text {
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.35);
}

.switch-link {
  color: #00f2fe;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.switch-link:hover {
  color: #4facfe;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 28px 20px;
    border-radius: 22px;
  }

  .auth-greeting {
    font-size: 1.4rem;
  }
}

```

## src/pages/Auth/Auth.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const initialSignup = { name: '', email: '', password: '', role: 'user' };
const initialLogin = { email: '', password: '' };

function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? false);
  const [form, setForm] = useState(location.state?.isLogin ? initialLogin : { ...initialSignup });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state?.isLogin ?? false;
    setIsLogin(target);
    setForm(target ? { ...initialLogin } : { ...initialSignup });
    setErrors({});
  }, [location.state?.isLogin]);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm((prev) => (prev.email !== undefined ? (prev.name !== undefined ? initialLogin : initialSignup) : (prev.name !== undefined ? initialLogin : initialSignup)));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && (!form.name || !form.name.trim())) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
      const user = users.find((u) => u.email === form.email && u.password === form.password);
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      localStorage.setItem('sa_user', JSON.stringify({ name: user.name, email: user.email, role: user.role }));
      navigate(user.role === 'admin' ? '/admin' : '/');
    } else {
      const users = JSON.parse(localStorage.getItem('sa_users') || '[]');
      if (users.find((u) => u.email === form.email)) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      const newUser = { name: form.name.trim(), email: form.email, password: form.password, role: form.role };
      users.push(newUser);
      localStorage.setItem('sa_users', JSON.stringify(users));
      localStorage.setItem('sa_user', JSON.stringify({ name: newUser.name, email: newUser.email, role: newUser.role }));
      navigate(newUser.role === 'admin' ? '/admin' : '/');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <div className="auth-toggle">
          <div className={`toggle-slider ${isLogin ? '' : 'right'}`} />
          <button type="button" className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => !isLogin && toggleMode()}>
            Sign In
          </button>
          <button type="button" className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => isLogin && toggleMode()}>
            Sign Up
          </button>
        </div>

        <div className="auth-header">
          <h2 className="auth-greeting">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-desc">{isLogin ? 'Sign in to continue learning' : 'Start your learning journey'}</p>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          noValidate
          variants={formVariants}
          initial="hidden"
          animate="visible"
          key={isLogin ? 'login' : 'signup'}
        >
          {!isLogin && (
            <motion.div className="field" variants={itemVariants}>
              <label>Account Type</label>
              <div className="field-wrap role-wrap">
                <span className="field-icon"><ShieldIcon /></span>
                <label className={`role-option ${form.role === 'user' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} />
                  User
                </label>
                <label className={`role-option ${form.role === 'admin' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} />
                  Admin
                </label>
              </div>
            </motion.div>
          )}

          {!isLogin && (
            <motion.div className={`field ${errors.name ? 'error' : ''}`} variants={itemVariants}>
              <label>Full Name</label>
              <div className="field-wrap">
                <span className="field-icon"><UserIcon /></span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" />
              </div>
              {errors.name && <span className="field-err">{errors.name}</span>}
            </motion.div>
          )}

          <motion.div className={`field ${errors.email ? 'error' : ''}`} variants={itemVariants}>
            <label>Email Address</label>
            <div className="field-wrap">
              <span className="field-icon"><MailIcon /></span>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" autoComplete="email" />
            </div>
            {errors.email && <span className="field-err">{errors.email}</span>}
          </motion.div>

          <motion.div className={`field ${errors.password ? 'error' : ''}`} variants={itemVariants}>
            <label>Password</label>
            <div className="field-wrap">
              <span className="field-icon"><LockIcon /></span>
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete={isLogin ? 'current-password' : 'new-password'} />
              <button type="button" className="toggle-pass" onClick={() => setShowPassword((prev) => !prev)} tabIndex={-1}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && <span className="field-err">{errors.password}</span>}
          </motion.div>

          <motion.button type="submit" className="submit-auth" variants={itemVariants} whileTap={{ scale: 0.98 }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </motion.button>
        </motion.form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span className="switch-link" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Auth;

```

## src/pages/Contact/Contact.css

```css
.contact-page {
  padding: 60px 5%;
  min-height: calc(100vh - 200px);
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.contact-header h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.contact-header p {
  color: var(--text-muted);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container {
  display: flex;
  gap: 50px;
  max-width: 1000px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
}

.contact-info {
  flex: 1;
}

.contact-info h3 {
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.info-item .icon {
  font-size: 1.5rem;
  background: var(--glass-bg);
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
}

.info-item p {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin: 0;
}

.contact-social {
  margin-top: 40px;
}

.contact-social h4 {
  margin-bottom: 15px;
  color: var(--text-muted);
}

.contact-form-container {
  flex: 1.5;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-muted);
}

.form-group input,
.form-group textarea {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 12px 15px;
  color: var(--text-main);
  font-family: var(--font-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-submit {
  margin-top: 10px;
  width: 100%;
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
    padding: 30px 20px;
  }
  
  .contact-info {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--glass-border);
  }
}

```

## src/pages/Contact/Contact.jsx

```jsx
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

```

## src/pages/Courses/Courses.css

```css
/* Premium Courses CSS Refactor */

.courses-page-premium {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding-bottom: 100px;
}

.courses-header-premium {
  padding: 80px 5% 40px;
  text-align: center;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.courses-controls-section {
  padding: 0 5%;
  position: relative;
  z-index: 5; /* higher than grid to allow dropdowns if any */
}

.courses-filters-card {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-sort-flex {
  display: flex;
  gap: 16px;
  align-items: center;
}

.premium-search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.premium-search-box svg {
  position: absolute;
  left: 20px;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
}

.premium-search-box input {
  width: 100%;
  padding: 16px 20px 16px 54px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: white;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.premium-search-box input:focus {
  border-color: #00f2fe;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.15);
}

.premium-sort-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 20px;
  border-radius: 14px;
}

.premium-sort-box span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.premium-sort-box select {
  background: transparent;
  color: white;
  border: none;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  appearance: none;
  padding-right: 20px;
  font-weight: 500;
}

.premium-sort-box select option {
  background: #14112e;
  color: white;
}

.filter-chips-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.level-chips, .toggle-chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.level-chip, .toggle-chip {
  padding: 10px 20px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.9rem;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-chip:hover, .toggle-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.level-chip.active {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border-color: transparent;
  color: #050311;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
}

.toggle-chip.active {
  background: rgba(0, 242, 254, 0.1);
  border-color: rgba(0, 242, 254, 0.3);
  color: #00f2fe;
}

.heart-icon { color: #ff3b30; font-size: 1.1rem; }
.book-icon { font-size: 1.1rem; }

/* Grid */
.courses-grid-section {
  padding: 0 5%;
  position: relative;
  z-index: 2;
}

.premium-courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state-wrapper {
  grid-column: 1 / -1;
}

/* Course Card */
.premium-course-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  padding: 24px;
}

.premium-course-card.is-enrolled {
  border-color: rgba(39, 201, 63, 0.3);
  background: rgba(39, 201, 63, 0.03);
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.course-emoji-box {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.course-emoji-box.large {
  width: 72px;
  height: 72px;
  font-size: 2.5rem;
  border-radius: 20px;
}

.card-top-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.heart-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
}

.heart-btn:hover {
  color: #ff3b30;
  transform: scale(1.1);
}

.heart-btn.active {
  color: #ff3b30;
}

.course-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}

.course-desc-trunc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20px;
  flex: 1;
}

.card-meta-row {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.meta-tag {
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* Progress UI */
.card-progress-ui {
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 12px;
}

.prog-text {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.prog-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.prog-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  border-radius: 4px;
  transition: width 0.4s ease;
}

/* Course Detail Modal */
.course-detail-modal {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  padding: 0;
  overflow: hidden;
}

.course-modal-header {
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.02);
}

.modal-meta-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.course-modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

/* Custom Scrollbar for Modal Body */
.scrollable::-webkit-scrollbar {
  width: 6px;
}
.scrollable::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.scrollable::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.modal-section-block {
  margin-bottom: 30px;
}

.modal-section-block h4 {
  font-size: 1.1rem;
  color: #00f2fe;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-section-block p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.modal-progress-block {
  background: rgba(0, 242, 254, 0.05);
  border: 1px solid rgba(0, 242, 254, 0.15);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.instruction-text {
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.instruction-text.faded {
  opacity: 0.5;
  font-style: italic;
}

.premium-syllabus-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.syll-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s;
}

.syll-item:not(.locked) {
  cursor: pointer;
}

.syll-item:not(.locked):hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 242, 254, 0.2);
}

.syll-item.completed {
  background: rgba(0, 242, 254, 0.03);
  border-color: rgba(0, 242, 254, 0.1);
}

.syll-item.completed .syll-text {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: line-through;
}

.syll-item.locked {
  opacity: 0.6;
}

.custom-chk {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: transparent;
  transition: all 0.2s;
}

.custom-chk.checked {
  background: #00f2fe;
  border-color: #00f2fe;
  color: #050311;
}

.syll-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.course-modal-footer {
  padding: 24px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
}

.course-modal-footer button {
  width: 100%;
}

@media (max-width: 768px) {
  .search-sort-flex, .filter-chips-flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .premium-sort-box {
    justify-content: space-between;
  }
}

```

## src/pages/Courses/Courses.jsx

```jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import SectionReveal, { RevealItem } from '../../components/ui/SectionReveal';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import "./Courses.css";
import { coursesData } from "../../coursesData";

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [completedSyllabusItems, setCompletedSyllabusItems] = useState({});
  const [sortBy, setSortBy] = useState("default");
  const [activeCourse, setActiveCourse] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("fav_courses");
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

      const storedEnrolled = localStorage.getItem("enrolled_courses");
      if (storedEnrolled) setEnrolled(JSON.parse(storedEnrolled));

      const storedProgress = localStorage.getItem("syllabus_progress");
      if (storedProgress) setCompletedSyllabusItems(JSON.parse(storedProgress));
    } catch (e) {
      console.error("Failed to load user progress", e);
    }
  }, []);

  const toggleFavorite = (courseTitle, e) => {
    e.stopPropagation();
    let updatedFavorites;
    if (favorites.includes(courseTitle)) {
      updatedFavorites = favorites.filter((title) => title !== courseTitle);
    } else {
      updatedFavorites = [...favorites, courseTitle];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("fav_courses", JSON.stringify(updatedFavorites));
  };

  const toggleEnroll = (courseTitle) => {
    let updatedEnrolled;
    if (enrolled.includes(courseTitle)) {
      if (window.confirm(`Are you sure you want to leave ${courseTitle}? Your progress will be reset.`)) {
        updatedEnrolled = enrolled.filter((title) => title !== courseTitle);
        const updatedProgress = { ...completedSyllabusItems };
        Object.keys(updatedProgress).forEach((key) => {
          if (key.startsWith(`${courseTitle}-`)) {
            delete updatedProgress[key];
          }
        });
        setCompletedSyllabusItems(updatedProgress);
        localStorage.setItem("syllabus_progress", JSON.stringify(updatedProgress));
      } else {
        return;
      }
    } else {
      updatedEnrolled = [...enrolled, courseTitle];
    }
    setEnrolled(updatedEnrolled);
    localStorage.setItem("enrolled_courses", JSON.stringify(updatedEnrolled));
  };

  const toggleSyllabusItem = (courseTitle, itemIndex) => {
    const key = `${courseTitle}-${itemIndex}`;
    const updatedProgress = {
      ...completedSyllabusItems,
      [key]: !completedSyllabusItems[key],
    };
    setCompletedSyllabusItems(updatedProgress);
    localStorage.setItem("syllabus_progress", JSON.stringify(updatedProgress));
  };

  const getCompletedCount = (courseTitle, syllabusArray) => {
    return syllabusArray.reduce((acc, _, idx) => {
      return acc + (completedSyllabusItems[`${courseTitle}-${idx}`] ? 1 : 0);
    }, 0);
  };

  const getProcessedCourses = () => {
    const filtered = coursesData.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === "All" || course.level.toLowerCase().includes(selectedLevel.toLowerCase());
      const matchesFavorite = !showOnlyFavorites || favorites.includes(course.title);
      const matchesEnrolled = !showOnlyEnrolled || enrolled.includes(course.title);
      return matchesSearch && matchesLevel && matchesFavorite && matchesEnrolled;
    });

    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "duration") {
      const getMonths = (durationStr) => {
        const val = parseInt(durationStr);
        return isNaN(val) ? 999 : val;
      };
      filtered.sort((a, b) => getMonths(a.duration) - getMonths(b.duration));
    }

    return filtered;
  };

  const processedCourses = getProcessedCourses();

  return (
    <div className="courses-page-premium">
      <AnimatedBackground variant="dynamic" />

      {/* Header */}
      <header className="courses-header-premium">
        <SectionReveal direction="down">
          <Badge variant="info" size="sm" className="mb-4">Explore Curriculum</Badge>
          <h1 className="hero-main-title">Premium <span className="text-gradient">IT Courses</span></h1>
          <p className="hero-subtitle">Comprehensive, state-of-the-art training programs to accelerate your tech career</p>
        </SectionReveal>
      </header>

      {/* Controls */}
      <section className="courses-controls-section">
        <SectionReveal direction="up" delay={0.1}>
          <GlassCard className="courses-filters-card">
            <div className="search-sort-flex">
              <div className="premium-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search courses, skills, tools..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="premium-sort-box">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Recommended</option>
                  <option value="name">Alphabetical (A-Z)</option>
                  <option value="duration">Duration (Shortest)</option>
                </select>
              </div>
            </div>

            <div className="filter-chips-flex">
              <div className="level-chips">
                {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button 
                    key={level} 
                    className={`level-chip ${selectedLevel === level ? "active" : ""}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="toggle-chips">
                <button 
                  className={`toggle-chip ${showOnlyFavorites ? 'active' : ''}`}
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                >
                  <span className="heart-icon">♥</span> Favorites ({favorites.length})
                </button>
                <button 
                  className={`toggle-chip ${showOnlyEnrolled ? 'active' : ''}`}
                  onClick={() => setShowOnlyEnrolled(!showOnlyEnrolled)}
                >
                  <span className="book-icon">📚</span> Enrolled ({enrolled.length})
                </button>
              </div>
            </div>
          </GlassCard>
        </SectionReveal>
      </section>

      {/* Grid */}
      <section className="courses-grid-section">
        <SectionReveal stagger={true} className="premium-courses-grid">
          {processedCourses.length > 0 ? (
            processedCourses.map((course, index) => {
              const isFav = favorites.includes(course.title);
              const isEnrolled = enrolled.includes(course.title);
              const completedCount = getCompletedCount(course.title, course.syllabus);
              const progressPercentage = Math.round((completedCount / course.syllabus.length) * 100);

              return (
                <RevealItem key={course.title}>
                  <GlassCard 
                    className={`premium-course-card ${isEnrolled ? 'is-enrolled' : ''}`} 
                    hover 
                    onClick={() => setActiveCourse(course)}
                  >
                    <div className="card-top-row">
                      <div className="course-emoji-box">{course.emoji}</div>
                      <div className="card-top-right">
                        {isEnrolled && <Badge variant="success" size="xs">Enrolled</Badge>}
                        <button 
                          className={`heart-btn ${isFav ? 'active' : ''}`} 
                          onClick={(e) => toggleFavorite(course.title, e)}
                        >
                          <svg viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-desc-trunc">{course.description}</p>
                    
                    {isEnrolled && (
                      <div className="card-progress-ui">
                        <div className="prog-text">
                          <span>Progress</span>
                          <span>{completedCount}/{course.syllabus.length}</span>
                        </div>
                        <div className="prog-bar-bg">
                          <div className="prog-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="card-meta-row">
                      <span className="meta-tag">⏱ {course.duration}</span>
                      <span className="meta-tag">📈 {course.level}</span>
                    </div>
                  </GlassCard>
                </RevealItem>
              );
            })
          ) : (
            <div className="empty-state-wrapper">
              <EmptyState 
                icon="🔍" 
                title="No Courses Found" 
                description="Try adjusting your search terms or filter selections to find what you're looking for." 
                actionLabel="Clear Filters"
                onAction={() => { setSearchTerm(''); setSelectedLevel('All'); setShowOnlyFavorites(false); setShowOnlyEnrolled(false); }}
              />
            </div>
          )}
        </SectionReveal>
      </section>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeCourse && (() => {
          const isEnrolled = enrolled.includes(activeCourse.title);
          const completedCount = getCompletedCount(activeCourse.title, activeCourse.syllabus);
          const progressPercentage = Math.round((completedCount / activeCourse.syllabus.length) * 100);

          return (
            <motion.div 
              className="premium-modal-backdrop" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActiveCourse(null)}
            >
              <motion.div 
                className="premium-modal course-detail-modal" 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }} 
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setActiveCourse(null)}>✕</button>
                
                <div className="course-modal-header">
                  <div className="course-emoji-box large">{activeCourse.emoji}</div>
                  <div>
                    <h2 className="modal-title">{activeCourse.title}</h2>
                    <div className="modal-meta-row">
                      <Badge variant="info">{activeCourse.level}</Badge>
                      <Badge variant="warning">{activeCourse.duration}</Badge>
                    </div>
                  </div>
                </div>

                <div className="course-modal-body scrollable">
                  <div className="modal-section-block">
                    <h4>About this Course</h4>
                    <p>{activeCourse.description}</p>
                  </div>

                  {isEnrolled && (
                    <div className="modal-progress-block">
                      <div className="prog-text">
                        <span>Syllabus Progress</span>
                        <strong className="text-cyan">{progressPercentage}% Completed</strong>
                      </div>
                      <div className="prog-bar-bg">
                        <div className="prog-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="modal-section-block">
                    <h4>Syllabus Details</h4>
                    <p className={`instruction-text ${!isEnrolled ? 'faded' : ''}`}>
                      {isEnrolled ? 'Click checklist items to mark them as completed:' : 'Enroll in this course to track your progress.'}
                    </p>
                    <ul className="premium-syllabus-list">
                      {activeCourse.syllabus.map((item, idx) => {
                        const isCompleted = !!completedSyllabusItems[`${activeCourse.title}-${idx}`];
                        return (
                          <li 
                            key={idx} 
                            className={`syll-item ${isCompleted ? 'completed' : ''} ${!isEnrolled ? 'locked' : ''}`}
                            onClick={() => isEnrolled && toggleSyllabusItem(activeCourse.title, idx)}
                          >
                            <div className="syll-check">
                              {isEnrolled ? (
                                <div className={`custom-chk ${isCompleted ? 'checked' : ''}`}>
                                  {isCompleted && '✓'}
                                </div>
                              ) : '⚡'}
                            </div>
                            <span className="syll-text">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="course-modal-footer">
                  {isEnrolled ? (
                    <Button 
                      variant="danger" 
                      onClick={() => { toggleEnroll(activeCourse.title); setActiveCourse(null); }}
                    >
                      Leave Course & Reset Progress
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={() => { toggleEnroll(activeCourse.title); }}
                    >
                      Enroll in Course
                    </Button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

export default Courses;

```

## src/pages/Home/Home.css

```css
/* Premium Home CSS Refactor */

.home-container {
  position: relative;
  overflow: hidden;
}

.section-padding {
  padding: 100px 5%;
  position: relative;
  z-index: 2;
}

.section-darker {
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.section-header-center {
  text-align: center;
  margin-bottom: 60px;
  max-width: 700px;
  margin-inline: auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* Hero Section */
.premium-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 90vh;
  padding: 0 8%;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.hero-content {
  flex: 1.2;
  max-width: 650px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 30px;
  color: #00f2fe;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #00f2fe;
  border-radius: 50%;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -1.5px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
}

.hero-cta-group {
  display: flex;
  gap: 16px;
}

.hero-visual {
  flex: 1;
  position: relative;
  perspective: 1000px;
}

/* Mockup Card in Hero */
.mockup-card {
  width: 100%;
  max-width: 500px;
  padding: 0;
  transform: rotateY(-10deg) rotateX(5deg);
  transform-style: preserve-3d;
  animation: floatMockup 8s ease-in-out infinite;
}

@keyframes floatMockup {
  0%, 100% { transform: rotateY(-10deg) rotateX(5deg) translateY(0); }
  50% { transform: rotateY(-15deg) rotateX(8deg) translateY(-20px); }
}

.mockup-header {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.2);
}

.window-controls {
  display: flex;
  gap: 6px;
}

.window-controls .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.mockup-title {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  font-family: monospace;
}

.mockup-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mockup-stats {
  display: flex;
  gap: 16px;
}

.mock-stat-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mock-stat-box span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.mock-stat-box strong {
  font-size: 1.1rem;
  color: #fff;
}

.mockup-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prog-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.prog-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  border-radius: 4px;
}

.mockup-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 60px;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, rgba(0, 242, 254, 0.2), rgba(0, 242, 254, 0.8));
  border-radius: 4px 4px 0 0;
  animation: growBar 2s ease-out forwards;
}

@keyframes growBar {
  from { transform: scaleY(0); transform-origin: bottom; }
  to { transform: scaleY(1); transform-origin: bottom; }
}

.floating-tag {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.tag-1 { top: -20px; right: 20px; }
.tag-2 { bottom: 40px; left: -30px; }

/* Overview Section */
.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.browser-mockup {
  padding: 0;
  height: 380px;
  display: flex;
  flex-direction: column;
}

.browser-top {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.browser-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.video-skeleton {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 1.2rem;
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);
}

.instructor-badge-skel {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.ava { font-size: 2rem; }
.inf .n { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
.inf .d { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); }

.premium-checklist {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.premium-checklist li {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.check-ring {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid rgba(0, 242, 254, 0.2);
  flex-shrink: 0;
}

.premium-checklist h3 {
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.premium-checklist p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

/* Features Grid */
.premium-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-interactive-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.feature-icon-large {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.feature-interactive-card h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
}

.feature-interactive-card p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  font-size: 0.95rem;
  margin-bottom: 24px;
  flex: 1;
}

.learn-more-link {
  color: #00f2fe;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.feature-interactive-card:hover .learn-more-link {
  opacity: 1;
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Timeline */
.workflow-timeline-premium {
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  margin: 40px auto 0;
  position: relative;
}

.workflow-timeline-premium::before {
  content: '';
  position: absolute;
  top: 24px;
  left: 40px;
  right: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.timeline-node {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.timeline-node:hover {
  transform: translateY(-5px);
}

.node-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #090615;
  border: 2px solid #00f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.4s ease;
}

.timeline-node.active .node-circle {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #050311;
  border-color: transparent;
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.4), 0 0 40px rgba(0, 242, 254, 0.2);
  transform: scale(1.1);
}

.timeline-node.active .node-label {
  color: #00f2fe;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.3);
}

.workflow-step-details {
  max-width: 600px;
  margin: 40px auto 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
}

.workflow-step-details::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f2fe, transparent);
}

.workflow-step-details h3 {
  color: #00f2fe;
  margin-bottom: 12px;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.workflow-step-details p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 1.05rem;
}

.node-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

/* CTA Box */
.cta-box {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 60px 40px !important;
}

.cta-title {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.cta-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* Modals */
.premium-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.premium-modal {
  background: rgba(15, 12, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02);
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 59, 48, 0.2);
  color: #ff3b30;
}

.modal-header-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.8rem;
  margin-bottom: 12px;
}

.modal-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 30px;
}

.modal-items-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.modal-item-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mi-avatar {
  font-size: 2rem;
}

.mi-info h4 {
  font-size: 1.05rem;
  margin-bottom: 6px;
}

.mi-info p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.mi-meta {
  display: inline-block;
  font-size: 0.75rem;
  padding: 4px 10px;
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  border-radius: 20px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 992px) {
  .premium-hero, .overview-grid {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-cta-group {
    justify-content: center;
  }
  
  .workflow-timeline-premium::before {
    display: none;
  }
  
  .workflow-timeline-premium {
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
  }
}

```

## src/pages/Home/Home.jsx

```jsx
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

```

## src/reportWebVitals.jsx

```jsx
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

## src/setupTests.jsx

```jsx
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

## src/utils/useMagneticHover.js

```js
import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useMagneticHover(strength = 0.5) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      x.set(distanceX * strength);
      y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, strength]);

  return { ref, x: springX, y: springY };
}

```

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}

```

