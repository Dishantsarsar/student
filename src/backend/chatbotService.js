/**
 * Computes the top N most popular courses from global_enrollments localStorage data.
 * @param {Array} courses - All courses array
 * @param {number} topN - How many to return
 * @returns {Array<{title, enrollments}>}
 */
function getPopularCourses(courses, topN = 5) {
  try {
    const enrollments = JSON.parse(localStorage.getItem('global_enrollments') || '{}');
    return courses
      .map(c => ({ title: c.title, enrollments: (enrollments[c.title] || []).length }))
      .filter(c => c.enrollments > 0)
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, topN);
  } catch {
    return [];
  }
}

/**
 * Sends a chat message to the Solution Adda AI backend.
 * Automatically enriches the request with:
 *  - All courses from localStorage (real-time)
 *  - Popularity ranking from enrollment data
 *  - Admin-trained custom Q&A from localStorage
 *  - Full conversation history for multi-turn context
 *
 * @param {string} message - The user's latest message.
 * @param {Array<{role: string, content: string}>} history - Prior conversation turns.
 * @param {AbortSignal} signal - Optional AbortController signal for timeouts.
 * @returns {Promise<string>} The AI's reply text.
 */
export async function sendMessageToChatbot(message, history = [], signal) {
  // 1. Read all courses (live, may include admin/teacher-added courses)
  let courses = [];
  try {
    courses = JSON.parse(localStorage.getItem('all_courses') || '[]');
  } catch { courses = []; }

  // 2. Compute popular courses from enrollment data
  const popularCourses = getPopularCourses(courses);

  // 3. Read admin-trained custom knowledge base
  let customKB = [];
  try {
    customKB = JSON.parse(localStorage.getItem('chatbot_custom_kb') || '[]');
  } catch { customKB = []; }

  // 4. Send everything to the server
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, courses, popularCourses, customKB }),
    signal
  });

  if (!response.ok) {
    let errMsg = 'Failed to get chat response';
    try {
      const errData = await response.json();
      errMsg = errData.error || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.reply;
}
