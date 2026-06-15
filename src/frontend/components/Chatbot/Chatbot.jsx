import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageToChatbot } from '../../../backend/chatbotService';
import './Chatbot.css';

/* ─────────────────────────────────────────────────────────────
   COLLEGE YEAR RECOMMENDATIONS (mirrors server config)
   ───────────────────────────────────────────────────────────── */
const YEAR_MAP = {
  '1st Year': {
    courses: ['C & C++ Programming', 'Python Programming', 'Web Development', 'Networking'],
    tip: 'Build your programming foundation strong!'
  },
  '2nd Year': {
    courses: ['Data Science', 'Database Management', 'Software Engineering', 'Java Development'],
    tip: 'Dive into core CS subjects and data handling.'
  },
  '3rd Year': {
    courses: ['Machine Learning', 'Artificial Intelligence', 'Cloud Computing', 'Cyber Security'],
    tip: 'Specialize and get internship-ready!'
  },
  '4th Year': {
    courses: ['Deep Learning', 'DevOps', 'Blockchain Development', 'Mobile App Development'],
    tip: 'Time to ace placements and build advanced skills!'
  }
};

/* ─────────────────────────────────────────────────────────────
   DYNAMIC LOCAL KB — built from actual courses in localStorage
   ───────────────────────────────────────────────────────────── */
function buildLocalKB(courses) {
  const baseKB = [
    {
      keywords: ['hi', 'hello', 'hey', 'namaste', 'hii', 'helo', 'good morning', 'good evening'],
      answer: '👋 Hello! I\'m **Adda AI**, your Solution Adda learning guide!\n\nI know all about our courses, pricing, enrollment, and can recommend what to study based on your college year. What would you like to know?'
    },
    {
      keywords: ['about', 'what is solution adda', 'platform overview', 'who are you'],
      answer: '🏫 **Solution Adda** is a premium online learning platform offering expert-led technology courses. We focus on hands-on, project-based learning so you\'re job-ready from day one!\n\nWe have 16 courses across Web Dev, AI/ML, Data Science, Cloud, Cyber Security, and more.'
    },
    {
      keywords: ['popular', 'trending', 'most enrolled', 'best course', 'top course', 'which is best'],
      answer: (() => {
        try {
          const enrollments = JSON.parse(localStorage.getItem('global_enrollments') || '{}');
          const sorted = Object.entries(enrollments)
            .map(([title, emails]) => ({ title, count: (emails || []).length }))
            .filter(c => c.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
          if (sorted.length === 0) return '🔥 Our **Web Development**, **Machine Learning**, and **Python Programming** courses are consistently popular! Ask me about any specific one.';
          return `🔥 **Most Popular Courses Right Now:**\n${sorted.map((c, i) => `${i + 1}. ${c.title} — ${c.count} students enrolled`).join('\n')}\n\nWould you like details about any of these?`;
        } catch {
          return '🔥 Our **Web Development**, **Machine Learning**, and **Artificial Intelligence** courses are very popular right now! Ask me for details on any.';
        }
      })()
    },
    {
      keywords: ['1st year', 'first year', 'fresher', 'just started', '1 year', 'freshman'],
      answer: `🎓 **For 1st Year Students — Build Your Foundation!**\n\nRecommended courses:\n${YEAR_MAP['1st Year'].courses.map(c => `• ${c}`).join('\n')}\n\n💡 ${YEAR_MAP['1st Year'].tip}`
    },
    {
      keywords: ['2nd year', 'second year', '2 year', 'sophomore'],
      answer: `📚 **For 2nd Year Students — Core CS Time!**\n\nRecommended courses:\n${YEAR_MAP['2nd Year'].courses.map(c => `• ${c}`).join('\n')}\n\n💡 ${YEAR_MAP['2nd Year'].tip}`
    },
    {
      keywords: ['3rd year', 'third year', '3 year', 'junior', 'internship'],
      answer: `🚀 **For 3rd Year Students — Specialize & Shine!**\n\nRecommended courses:\n${YEAR_MAP['3rd Year'].courses.map(c => `• ${c}`).join('\n')}\n\n💡 ${YEAR_MAP['3rd Year'].tip}`
    },
    {
      keywords: ['4th year', 'fourth year', '4 year', 'final year', 'senior', 'placement', 'placements', 'campus placement'],
      answer: `🏆 **For 4th Year Students — Placement Ready!**\n\nRecommended courses:\n${YEAR_MAP['4th Year'].courses.map(c => `• ${c}`).join('\n')}\n\n💡 ${YEAR_MAP['4th Year'].tip}\n\nOur placement support: mock interviews, resume reviews, alumni referrals!`
    },
    {
      keywords: ['certificate', 'certification', 'cert', 'linkedin', 'credential', 'recognized'],
      answer: '🏅 Yes! Every completed course earns you an **industry-recognized certificate**:\n• Includes your name, skills, date & instructor signature\n• Shareable on LinkedIn with verification link\n• Recognized by 500+ hiring partners!'
    },
    {
      keywords: ['price', 'cost', 'fee', 'pricing', 'how much', 'rupees', 'payment', 'emi', 'discount'],
      answer: '💰 **Pricing**:\n• Multiple affordable tiers per course\n• First 2 lessons FREE — no card needed!\n• Pay via: UPI, Cards, Net Banking, 0% EMI\n• Group discounts: sales@solutionadda.com\n• **7-day money-back guarantee!**'
    },
    {
      keywords: ['enroll', 'sign up', 'register', 'join', 'start', 'how to join', 'get started'],
      answer: '🚀 **Enroll in 3 steps:**\n1. Click **"Sign Up"** (top-right of the page)\n2. Fill details & verify your email\n3. Choose your course & start immediately!\n\nLifetime access. No deadlines. Learn at your own pace!'
    },
    {
      keywords: ['duration', 'how long', 'months', 'self paced', 'deadline', 'schedule', 'time commitment'],
      answer: '📅 Course durations range from **3 to 8 months**, all self-paced:\n• 100% flexible — no deadlines\n• Lifetime access to materials\n• Learn on phone, tablet, or laptop\n• Optional live Q&A sessions every Sunday'
    },
    {
      keywords: ['job', 'career', 'placement', 'resume', 'interview', 'employment', 'hiring'],
      answer: '💼 **Career Support includes:**\n• Portfolio & resume review sessions\n• LinkedIn profile optimization\n• 3 mock interviews (technical + HR)\n• Alumni referral network\n• Exclusive job board openings\n\n**85% of premium graduates** get placed within 6 months!'
    },
    {
      keywords: ['contact', 'support', 'help', 'email', 'reach'],
      answer: '📞 **Contact us:**\n• 📧 Support: support@solutionadda.com\n• 📧 Sales: sales@solutionadda.com\n• 💬 Discord: 24/7 community\n• Response within 4 business hours'
    },
    {
      keywords: ['thank', 'thanks', 'great', 'awesome', 'helpful', 'nice'],
      answer: '😊 You\'re welcome! Feel free to ask anything else. Happy learning with Solution Adda! 🚀'
    }
  ];

  // Dynamically add one KB entry per actual course
  courses.forEach(course => {
    if (!course?.title) return;
    const titleWords = course.title.toLowerCase().split(/\s+/);
    baseKB.push({
      keywords: [
        course.title.toLowerCase(),
        ...titleWords.filter(w => w.length > 3)
      ],
      answer: `📚 **${course.title}**\n• Level: ${course.level}\n• Duration: ${course.duration}\n• ${course.description}\n\n**Topics covered:**\n${(course.syllabus || []).map(s => `• ${s}`).join('\n')}\n\nWould you like to know about pricing or enrollment?`
    });
  });

  // Add admin-trained custom Q&A at highest priority
  try {
    const customKB = JSON.parse(localStorage.getItem('chatbot_custom_kb') || '[]');
    customKB.forEach(item => {
      if (item?.question && item?.answer) {
        baseKB.unshift({
          keywords: item.question.toLowerCase().split(/\s+/).filter(w => w.length > 2),
          answer: item.answer,
          exact: item.question.toLowerCase()
        });
      }
    });
  } catch { /* ignore */ }

  return baseKB;
}

/* ─────────────────────────────────────────────────────────────
   SMART LOCAL MATCHER
   ───────────────────────────────────────────────────────────── */
function findLocal(msg, kb) {
  const lower = msg.toLowerCase().replace(/[?.!,'"]/g, '').trim();
  const words = lower.split(/\s+/);
  let best = null, bestScore = 0;

  for (const item of kb) {
    // Exact question match (for custom trained entries)
    if (item.exact && lower.includes(item.exact)) return item.answer;

    let score = 0;
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        score += kw.split(/\s+/).length * 3;
      } else {
        const kwWords = kw.split(/\s+/);
        for (const kwWord of kwWords) {
          if (kwWord.length > 3 && words.some(w => w === kwWord || w.includes(kwWord))) {
            score += 1;
          }
        }
      }
    }
    if (score > bestScore) { bestScore = score; best = item.answer; }
  }
  return bestScore >= 2 ? best : null;
}

/* ─────────────────────────────────────────────────────────────
   MARKDOWN RENDERER — supports **bold** and line breaks
   ───────────────────────────────────────────────────────────── */
function renderText(text) {
  if (!text) return null;
  return text.split('\n').map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={lineIdx}>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
        )}
        {lineIdx < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

/* ─────────────────────────────────────────────────────────────
   MAIN CHATBOT COMPONENT
   ───────────────────────────────────────────────────────────── */
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: '👋 Hi! I\'m **Adda AI**, your Solution Adda learning assistant!\n\nI can help you:\n• Explore all our courses\n• Find courses by your college year\n• Check pricing & enrollment\n• Career & placement guidance\n\nWhat would you like to know? 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Load courses from localStorage (updates whenever courses change)
  useEffect(() => {
    const loadCourses = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('all_courses') || '[]');
        setCourses(stored);
      } catch { setCourses([]); }
    };
    loadCourses();
    // Re-read whenever storage changes (e.g. admin adds a course)
    window.addEventListener('storage', loadCourses);
    return () => window.removeEventListener('storage', loadCourses);
  }, []);

  // Auto-scroll only when open
  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const addBotMessage = useCallback((text) => {
    setMessages(prev => [...prev, { from: 'bot', text }]);
  }, []);

  const handleYearSelect = (year) => {
    setShowYearPicker(false);
    const yearText = `What courses do you recommend for ${year} college students?`;
    setMessages(prev => [...prev, { from: 'user', text: yearText }]);
    const kb = buildLocalKB(courses);
    const local = findLocal(yearText, kb);
    if (local) {
      addBotMessage(local);
      setHistory(prev => [
        ...prev,
        { role: 'user', content: yearText },
        { role: 'assistant', content: local }
      ]);
    } else {
      sendToServer(yearText);
    }
  };

  const sendToServer = async (text) => {
    setLoading(true);
    const updatedHistory = [...history, { role: 'user', content: text }];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const reply = await sendMessageToChatbot(text, updatedHistory, controller.signal);
      clearTimeout(timer);
      addBotMessage(reply);
      setHistory([...updatedHistory, { role: 'assistant', content: reply }]);
    } catch {
      clearTimeout(timer);
      const kb = buildLocalKB(courses);
      const local = findLocal(text, kb);
      const fallback = local || '🤔 I\'m not sure about that! Try emailing **support@solutionadda.com** or ask me about our courses, pricing, or college year recommendations!';
      addBotMessage(fallback);
      setHistory([...updatedHistory, { role: 'assistant', content: fallback }]);
    }
    setLoading(false);
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages(prev => [...prev, { from: 'user', text: trimmed }]);
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: trimmed }]);

    // Try local KB first for instant response
    const kb = buildLocalKB(courses);
    const local = findLocal(trimmed, kb);
    if (local) {
      addBotMessage(local);
      setHistory(prev => [...prev, { role: 'assistant', content: local }]);
    } else {
      // Fall through to AI server
      await sendToServer(trimmed);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const quickSuggestions = [
    { label: '📚 All Courses', msg: 'Show me all available courses' },
    { label: '🔥 Popular', msg: 'What are the most popular courses?' },
    { label: '🎓 By Year', action: () => setShowYearPicker(true) },
    { label: '💰 Pricing', msg: 'What are the pricing options?' },
    { label: '💼 Careers', msg: 'What career support do you offer?' }
  ];

  return (
    <>
      {/* FAB */}
      <button
        className={`chat-fab ${open ? 'hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Open Adda AI chat"
        title="Chat with Adda AI"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="fab-pulse" />
      </button>

      {/* Chat Panel */}
      <div className={`chat-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Adda AI Support Chat">

        {/* Header */}
        <div className="chat-head">
          <div className="chat-head-left">
            <div className="chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <span className="chat-name">Adda AI</span>
              <span className="chat-status">● Online — {courses.length} courses loaded</span>
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
        </div>

        {/* Messages */}
        <div className="chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.from}`}>
              <div className="msg-bubble">{renderText(m.text)}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg bot">
              <div className="msg-bubble typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* Year Picker overlay */}
          {showYearPicker && (
            <div className="year-picker">
              <p className="year-picker-title">🎓 Select your college year:</p>
              {Object.keys(YEAR_MAP).map(year => (
                <button key={year} className="year-btn" onClick={() => handleYearSelect(year)}>
                  {year}
                  <span className="year-btn-sub">{YEAR_MAP[year].tip}</span>
                </button>
              ))}
              <button className="year-cancel" onClick={() => setShowYearPicker(false)}>Cancel</button>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Quick suggestion chips — always visible */}
        <div className="chat-suggestions">
          {quickSuggestions.map(s => (
            <button
              key={s.label}
              className="suggestion-chip"
              onClick={() => {
                if (s.action) { s.action(); }
                else { setInput(s.msg); setTimeout(() => inputRef.current?.focus(), 50); }
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-foot">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about courses, pricing, careers..."
            disabled={loading}
            aria-label="Type your message"
          />
          <button
            className="chat-send"
            onClick={send}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
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
