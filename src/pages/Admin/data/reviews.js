// ============================================
// SOLUTION ADDA — Reviews Mock Data
// ============================================

export const reviews = [
  { id: 1, studentName: 'Ananya Roy', studentEmail: 'ananya.roy@email.com', course: 'Web Development Bootcamp', rating: 5, comment: 'Excellent course content and structure! The projects were incredibly practical and helped me land my first developer job.', date: '2025-06-18', status: 'approved' },
  { id: 2, studentName: 'Karan Joshi', studentEmail: 'karan.joshi@email.com', course: 'Python for Data Science', rating: 4, comment: 'Great explanations and clear teaching style. Could use more real-world projects though.', date: '2025-06-17', status: 'approved' },
  { id: 3, studentName: 'Meera Nair', studentEmail: 'meera.nair@email.com', course: 'Machine Learning A-Z', rating: 5, comment: 'Best ML course I have ever taken! Dr. Rajesh explains complex concepts so simply. Highly recommended!', date: '2025-06-17', status: 'approved' },
  { id: 4, studentName: 'Dev Patel', studentEmail: 'dev.patel@email.com', course: 'CI/CD & DevOps Engineering', rating: 3, comment: 'Good foundational content but could use more hands-on labs and real deployment scenarios.', date: '2025-06-16', status: 'pending' },
  { id: 5, studentName: 'Sneha Patel', studentEmail: 'sneha.patel@email.com', course: 'AWS Cloud Practitioner', rating: 5, comment: 'Amazing course! Passed my AWS certification on the first attempt thanks to this course.', date: '2025-06-15', status: 'approved' },
  { id: 6, studentName: 'Vikram Singh', studentEmail: 'vikram.singh@email.com', course: 'Ethical Hacking Masterclass', rating: 4, comment: 'Very interesting and well-paced. The CTF challenges were my favorite part.', date: '2025-06-14', status: 'approved' },
  { id: 7, studentName: 'Ishita Banerjee', studentEmail: 'ishita.b@email.com', course: 'Generative AI & LLMs', rating: 5, comment: 'Cutting-edge content! Learned to build production-ready AI applications. This course is worth every penny.', date: '2025-06-13', status: 'approved' },
  { id: 8, studentName: 'Rohan Kapoor', studentEmail: 'rohan.kapoor@email.com', course: 'CCNA Networking Essentials', rating: 2, comment: 'Content is outdated and needs to be refreshed. Some labs did not work properly.', date: '2025-06-12', status: 'pending' },
  { id: 9, studentName: 'Divya Menon', studentEmail: 'divya.menon@email.com', course: 'Python Programming Fundamentals', rating: 5, comment: 'Perfect for beginners! Prof. Meena makes learning Python so enjoyable and easy to follow.', date: '2025-06-11', status: 'approved' },
  { id: 10, studentName: 'Aditya Tiwari', studentEmail: 'aditya.tiwari@email.com', course: 'Java Spring Boot Mastery', rating: 4, comment: 'Comprehensive coverage of Spring Boot. The microservices section was particularly helpful.', date: '2025-06-10', status: 'approved' },
  { id: 11, studentName: 'Siddharth Malhotra', studentEmail: 'sid.malhotra@email.com', course: 'AWS Cloud Practitioner', rating: 4, comment: 'Solid course for cloud beginners. Would love more advanced AWS topics covered.', date: '2025-06-09', status: 'approved' },
  { id: 12, studentName: 'Tanvi Desai', studentEmail: 'tanvi.desai@email.com', course: 'Python for Data Science', rating: 3, comment: 'Decent course but the pace is a bit fast for beginners. Needs more practice exercises.', date: '2025-06-08', status: 'pending' },
  { id: 13, studentName: 'Harsh Pandey', studentEmail: 'harsh.pandey@email.com', course: 'Ethical Hacking Masterclass', rating: 5, comment: 'Incredible course! Vikram sir is an amazing instructor. Learned so much about penetration testing.', date: '2025-06-07', status: 'approved' },
  { id: 14, studentName: 'Kavya Iyer', studentEmail: 'kavya.iyer@email.com', course: 'Web Development Bootcamp', rating: 1, comment: 'This is spam review content.', date: '2025-06-06', status: 'hidden' },
  { id: 15, studentName: 'Nikhil Agarwal', studentEmail: 'nikhil.agarwal@email.com', course: 'Software Architecture & Design', rating: 4, comment: 'Good introduction to software design patterns. The case studies were very insightful.', date: '2025-06-05', status: 'approved' },
  { id: 16, studentName: 'Ravi Kumar', studentEmail: 'ravi.kumar@email.com', course: 'Python Programming Fundamentals', rating: 5, comment: 'As someone who knew nothing about programming, this course was a game changer for me!', date: '2025-06-04', status: 'pending' },
  { id: 17, studentName: 'Sanya Gupta', studentEmail: 'sanya.gupta@email.com', course: 'Flutter Mobile Development', rating: 4, comment: 'Love the practical approach. Built my first app by the end of week 3!', date: '2025-06-03', status: 'approved' },
  { id: 18, studentName: 'Amit Shah', studentEmail: 'amit.shah@email.com', course: 'Solidity & Web3 Development', rating: 3, comment: 'Interesting but the blockchain space moves so fast. Some content already feels dated.', date: '2025-06-02', status: 'pending' },
  { id: 19, studentName: 'Priya Sharma', studentEmail: 'priya.sharma@email.com', course: 'Machine Learning A-Z', rating: 5, comment: 'This course completely changed my career trajectory. Now working as an ML engineer. Thank you!', date: '2025-06-01', status: 'approved' },
  { id: 20, studentName: 'Arjun Mehta', studentEmail: 'arjun.mehta@email.com', course: 'Web Development Bootcamp', rating: 4, comment: 'Very thorough coverage of modern web development. The React section was especially well done.', date: '2025-05-30', status: 'approved' },
];

export const reviewFilters = {
  status: ['all', 'approved', 'pending', 'hidden'],
  rating: ['All Ratings', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
};
