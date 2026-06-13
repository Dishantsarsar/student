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
    res.status(500).json({ error: 'Failed to get response' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
