// ============================================
// SOLUTION ADDA — Support Tickets Mock Data
// ============================================

export const supportTickets = [
  { id: 'TKT-1001', studentName: 'Ravi Kumar', studentEmail: 'ravi.kumar@email.com', subject: 'Cannot access course material', description: 'I enrolled in Python Programming Fundamentals but the video lectures are showing "Access Denied" error.', priority: 'high', status: 'open', category: 'access', createdAt: '2025-06-18T14:30:00', messages: [
    { sender: 'student', text: 'I enrolled in Python Programming Fundamentals but the video lectures are showing "Access Denied" error.', timestamp: '2025-06-18T14:30:00' },
  ]},
  { id: 'TKT-1002', studentName: 'Sanya Gupta', studentEmail: 'sanya.gupta@email.com', subject: 'Payment not reflecting', description: 'I made a payment of ₹5,499 for Flutter Mobile Development but my enrollment is not updated.', priority: 'urgent', status: 'open', category: 'payment', createdAt: '2025-06-18T13:00:00', messages: [
    { sender: 'student', text: 'I made a payment of ₹5,499 for Flutter Mobile Development but my enrollment is not updated. Transaction ID: TXN20250618001', timestamp: '2025-06-18T13:00:00' },
  ]},
  { id: 'TKT-1003', studentName: 'Amit Shah', studentEmail: 'amit.shah@email.com', subject: 'Certificate download issue', description: 'My certificate for Solidity & Web3 shows as issued but the download button is not working.', priority: 'medium', status: 'in-progress', category: 'certificate', createdAt: '2025-06-18T12:00:00', messages: [
    { sender: 'student', text: 'My certificate for Solidity & Web3 shows as issued but the download button is not working.', timestamp: '2025-06-18T12:00:00' },
    { sender: 'admin', text: 'We are looking into this issue. It seems to be a temporary server glitch. We will have it fixed within 24 hours.', timestamp: '2025-06-18T14:00:00' },
  ]},
  { id: 'TKT-1004', studentName: 'Pooja Reddy', studentEmail: 'pooja.reddy@email.com', subject: 'Wrong course enrolled', description: 'I wanted to enroll in Web Development but got enrolled in Database Management by mistake.', priority: 'high', status: 'open', category: 'enrollment', createdAt: '2025-06-18T10:00:00', messages: [
    { sender: 'student', text: 'I wanted to enroll in Web Development but got enrolled in Database Management by mistake. Please help switch my course.', timestamp: '2025-06-18T10:00:00' },
  ]},
  { id: 'TKT-1005', studentName: 'Arjun Mehta', studentEmail: 'arjun.mehta@email.com', subject: 'Video quality poor', description: 'The video quality for React Advanced module is very low, even on high settings.', priority: 'low', status: 'resolved', category: 'content', createdAt: '2025-06-17T09:00:00', messages: [
    { sender: 'student', text: 'The video quality for React Advanced module is very low, even on high settings.', timestamp: '2025-06-17T09:00:00' },
    { sender: 'admin', text: 'Thank you for reporting. We have re-encoded the videos in HD quality. Please clear your browser cache and try again.', timestamp: '2025-06-17T11:00:00' },
    { sender: 'student', text: 'Working great now! Thank you for the quick fix.', timestamp: '2025-06-17T12:00:00' },
  ]},
  { id: 'TKT-1006', studentName: 'Priya Sharma', studentEmail: 'priya.sharma@email.com', subject: 'Request for course extension', description: 'My Data Science course is expiring in 2 days but I still have 8 lessons remaining.', priority: 'medium', status: 'in-progress', category: 'enrollment', createdAt: '2025-06-17T08:00:00', messages: [
    { sender: 'student', text: 'My Data Science course is expiring in 2 days but I still have 8 lessons remaining. Can I get a 2-week extension?', timestamp: '2025-06-17T08:00:00' },
    { sender: 'admin', text: 'We are reviewing your request. Given your excellent progress, we should be able to grant the extension.', timestamp: '2025-06-17T10:00:00' },
  ]},
  { id: 'TKT-1007', studentName: 'Meera Nair', studentEmail: 'meera.nair@email.com', subject: 'Assignment submission error', description: 'I am getting a 500 error when trying to submit my Deep Learning project assignment.', priority: 'high', status: 'open', category: 'technical', createdAt: '2025-06-16T15:00:00', messages: [
    { sender: 'student', text: 'I am getting a 500 error when trying to submit my Deep Learning project assignment. I have tried different browsers.', timestamp: '2025-06-16T15:00:00' },
  ]},
  { id: 'TKT-1008', studentName: 'Rohan Kapoor', studentEmail: 'rohan.kapoor@email.com', subject: 'Refund request', description: 'I would like to request a refund for CCNA Networking Essentials as the content did not meet my expectations.', priority: 'medium', status: 'resolved', category: 'payment', createdAt: '2025-06-15T11:00:00', messages: [
    { sender: 'student', text: 'I would like to request a refund for CCNA Networking Essentials as the content did not meet my expectations.', timestamp: '2025-06-15T11:00:00' },
    { sender: 'admin', text: 'We are sorry to hear that. As per our refund policy, we have processed a full refund. It will reflect in 5-7 business days.', timestamp: '2025-06-15T14:00:00' },
    { sender: 'student', text: 'Received the refund. Thank you for the prompt response.', timestamp: '2025-06-16T10:00:00' },
  ]},
  { id: 'TKT-1009', studentName: 'Ishita Banerjee', studentEmail: 'ishita.b@email.com', subject: 'Quiz answers seem incorrect', description: 'Question 15 in the AI module quiz has an incorrect answer marked as correct.', priority: 'low', status: 'resolved', category: 'content', createdAt: '2025-06-14T16:00:00', messages: [
    { sender: 'student', text: 'Question 15 in the AI module quiz has an incorrect answer marked as correct. The correct answer should be B not D.', timestamp: '2025-06-14T16:00:00' },
    { sender: 'admin', text: 'Thank you for catching that! We have corrected the quiz and credited you with full marks for that question.', timestamp: '2025-06-14T18:00:00' },
  ]},
  { id: 'TKT-1010', studentName: 'Divya Menon', studentEmail: 'divya.menon@email.com', subject: 'Profile update not saving', description: 'When I try to update my profile photo and phone number, the changes are not being saved.', priority: 'low', status: 'open', category: 'technical', createdAt: '2025-06-14T09:00:00', messages: [
    { sender: 'student', text: 'When I try to update my profile photo and phone number, the changes are not being saved. Getting a timeout error.', timestamp: '2025-06-14T09:00:00' },
  ]},
  { id: 'TKT-1011', studentName: 'Karan Joshi', studentEmail: 'karan.joshi@email.com', subject: 'Suggest new course topic', description: 'Would love to see a course on Rust programming and systems-level development.', priority: 'low', status: 'resolved', category: 'feedback', createdAt: '2025-06-13T14:00:00', messages: [
    { sender: 'student', text: 'Would love to see a course on Rust programming and systems-level development. There is huge demand for it!', timestamp: '2025-06-13T14:00:00' },
    { sender: 'admin', text: 'Thank you for the suggestion! We have added it to our course roadmap. Stay tuned for updates!', timestamp: '2025-06-13T16:00:00' },
  ]},
  { id: 'TKT-1012', studentName: 'Harsh Pandey', studentEmail: 'harsh.pandey@email.com', subject: 'Lab environment not loading', description: 'The virtual lab environment for Ethical Hacking course is stuck on loading screen.', priority: 'urgent', status: 'in-progress', category: 'technical', createdAt: '2025-06-13T10:00:00', messages: [
    { sender: 'student', text: 'The virtual lab environment for Ethical Hacking course is stuck on loading screen for over an hour.', timestamp: '2025-06-13T10:00:00' },
    { sender: 'admin', text: 'We are aware of this issue and our DevOps team is working on it. Expected resolution: 2 hours.', timestamp: '2025-06-13T11:00:00' },
  ]},
];

export const supportFilters = {
  status: ['all', 'open', 'in-progress', 'resolved'],
  priority: ['All Priorities', 'urgent', 'high', 'medium', 'low'],
  category: ['All Categories', 'access', 'payment', 'certificate', 'enrollment', 'content', 'technical', 'feedback'],
};
