import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import Razorpay from 'razorpay';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const apiKey = process.env.GROQ_API_KEY;
let groq = null;
if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_groq_api_key_here')) {
  try {
    groq = new Groq({ apiKey });
    console.log('✅ Groq client initialized successfully.');
  } catch (e) {
    console.error('Failed to initialize Groq client:', e.message);
  }
} else {
  console.warn('⚠️  WARNING: GROQ_API_KEY is missing or placeholder. Chatbot runs in local fallback mode.');
}

/* ─────────────────────────────────────────────────────────────
   RAZORPAY INITIALIZATION
   ───────────────────────────────────────────────────────────── */
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
let razorpay = null;
if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('your_razorpay_key_id')) {
  try {
    razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
    console.log('✅ Razorpay initialized successfully.');
  } catch (e) {
    console.error('Failed to initialize Razorpay:', e.message);
  }
} else {
  console.warn('⚠️  WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing. Payment API disabled.');
}

/* ─────────────────────────────────────────────────────────────
   COLLEGE YEAR → COURSE RECOMMENDATIONS MAP
   ───────────────────────────────────────────────────────────── */
const YEAR_RECOMMENDATIONS = {
  '1st year': {
    label: '1st Year College (Foundation)',
    desc: 'Build strong programming fundamentals',
    courses: ['C & C++ Programming', 'Python Programming', 'Web Development', 'Networking'],
    reason: 'These courses build core programming fundamentals essential for all CS branches.'
  },
  '2nd year': {
    label: '2nd Year College (Core CS)',
    desc: 'Dive into data, databases and algorithms',
    courses: ['Data Science', 'Database Management', 'Software Engineering', 'Java Development'],
    reason: 'Perfect complement to your OS, DBMS, and algorithms coursework.'
  },
  '3rd year': {
    label: '3rd Year College (Specialization)',
    desc: 'Specialize in high-demand technologies',
    courses: ['Machine Learning', 'Artificial Intelligence', 'Cloud Computing', 'Cyber Security'],
    reason: 'Ideal for building specialization and internship-ready skills.'
  },
  '4th year': {
    label: '4th Year College (Placement Ready)',
    desc: 'Prepare for placements and jobs',
    courses: ['Deep Learning', 'DevOps', 'Blockchain Development', 'Mobile App Development'],
    reason: 'These advanced courses and interview prep will make you stand out in placements.'
  }
};

/* ─────────────────────────────────────────────────────────────
   STATIC PLATFORM INFO (always included)
   ───────────────────────────────────────────────────────────── */
const STATIC_CONTEXT = `
PLATFORM INFO:
- Name: Solution Adda — Premium Online Learning Platform (India)
- Focus: Technology education with hands-on, project-based learning
- All courses include: real projects, mentorship, certificates, community access
- Certificates are industry-recognized and shareable on LinkedIn
- Pricing: Competitive, EMI available, 7-day money-back guarantee
- Support: support@solutionadda.com | Discord 24/7 | this chatbot
- Enrollment: Click "Sign Up" top-right → choose course → start immediately
- Self-paced learning with lifetime access
- Community: Private Discord with 10,000+ members, weekly hackathons
- Career support: resume review, mock interviews, alumni network, job board

COLLEGE YEAR RECOMMENDATIONS:
${Object.entries(YEAR_RECOMMENDATIONS).map(([year, data]) => `
For ${data.label}:
  Recommended courses: ${data.courses.join(', ')}
  Why: ${data.reason}
`).join('')}

GENERAL FAQ:
- No prior experience needed for beginner courses
- Courses range from 3 to 8 months
- Free first 2 lessons for every course — no credit card needed
- Payment: UPI, Cards (Visa/Mastercard/RuPay), Net Banking, 0% EMI
- Group/corporate discounts: sales@solutionadda.com
`;

/* ─────────────────────────────────────────────────────────────
   DYNAMIC SYSTEM PROMPT BUILDER
   ───────────────────────────────────────────────────────────── */
function buildSystemPrompt(courses = [], popularCourses = [], customKB = []) {
  // Build course details section
  let coursesSection = '';
  if (courses.length > 0) {
    coursesSection = `\nALL AVAILABLE COURSES (${courses.length} total):\n`;
    courses.forEach((c, i) => {
      coursesSection += `\n${i + 1}. ${c.emoji || '📚'} ${c.title} — ${c.level} | ${c.duration}\n`;
      coursesSection += `   About: ${c.description}\n`;
      if (c.syllabus && c.syllabus.length > 0) {
        coursesSection += `   Topics covered: ${c.syllabus.join(', ')}\n`;
      }
    });
  }

  // Build popular courses section
  let popularSection = '';
  if (popularCourses.length > 0) {
    popularSection = `\nMOST POPULAR COURSES RIGHT NOW:\n`;
    popularCourses.forEach((p, i) => {
      popularSection += `${i + 1}. ${p.title} — ${p.enrollments} students enrolled\n`;
    });
  }

  // Build custom KB section from admin training
  let customSection = '';
  if (customKB.length > 0) {
    customSection = `\nADMIN-TRAINED KNOWLEDGE (highest priority — always answer these accurately):\n`;
    customKB.forEach(item => {
      customSection += `Q: ${item.question}\nA: ${item.answer}\n\n`;
    });
  }

  return `You are "Adda AI", the intelligent virtual assistant for **Solution Adda** — a premium online learning platform.

Your personality:
- Warm, encouraging, and knowledgeable — like a senior student or mentor
- Use friendly language; occasional Hindi words are fine (e.g., "bilkul", "zaroor")
- Keep answers concise but complete — use bullet points and numbered lists for readability
- When recommending courses, always mention the duration and level
- Always offer to help further at the end of your response

${STATIC_CONTEXT}
${coursesSection}
${popularSection}
${customSection}

IMPORTANT RULES:
1. Only answer questions about Solution Adda or education/learning topics
2. For unrelated questions (politics, weather, news), politely redirect: "I'm here for Solution Adda queries! Ask me about courses, pricing, or your learning path 😊"
3. Never invent information not listed above
4. If unsure about something specific, say: "For exact details, email support@solutionadda.com — they respond within 4 hours!"
5. When asked about which course to take, always ask the user's background/year if not provided
6. For "most popular" queries, use the popularity data provided above
7. Custom admin-trained answers take highest priority over general knowledge
8. Keep responses under 300 words unless deeply technical detail is needed`;
}

/* ─────────────────────────────────────────────────────────────
   CHAT API ENDPOINT
   ───────────────────────────────────────────────────────────── */
app.post('/api/chat', async (req, res) => {
  const {
    message,
    history = [],
    courses = [],
    popularCourses = [],
    customKB = []
  } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  if (!groq) {
    return res.status(503).json({
      error: 'Groq chatbot is not configured. Please set GROQ_API_KEY in server/.env file.'
    });
  }

  const systemPrompt = buildSystemPrompt(courses, popularCourses, customKB);

  // Keep last 10 turns of history to maintain context without exceeding token limits
  const recentHistory = history.slice(-10);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: message }
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.65,
      max_tokens: 600,
      top_p: 0.9,
    });

    const reply = completion.choices[0]?.message?.content?.trim()
      || 'Sorry, I could not generate a response right now.';
    res.json({ reply });
  } catch (err) {
    console.error('Groq API error:', err.message);
    res.status(500).json({ error: 'Failed to get response from AI. Try again in a moment.' });
  }
});

/* ─────────────────────────────────────────────────────────────
   RAZORPAY ORDER CREATION ENDPOINT
   ───────────────────────────────────────────────────────────── */
app.post('/api/create-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (!razorpay) {
    return res.status(503).json({
      error: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env file.'
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error('Razorpay order creation error:', err.message);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Razorpay key endpoint (frontend needs the key ID to initialize checkout)
app.get('/api/razorpay-key', (req, res) => {
  res.json({ key: razorpayKeyId || '' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', groqConfigured: !!groq, razorpayConfigured: !!razorpay });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
