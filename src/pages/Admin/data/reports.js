// ============================================
// SOLUTION ADDA — Reports Mock Data
// ============================================

export const reportCards = [
  {
    id: 'student-report',
    title: 'Student Report',
    description: 'Complete analysis of student registrations, activity, and engagement metrics.',
    icon: 'Users',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    stats: { total: 12847, active: 8721, new: 1240 },
  },
  {
    id: 'course-report',
    title: 'Course Report',
    description: 'Course performance, enrollment trends, and completion rates overview.',
    icon: 'BookOpen',
    gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    stats: { total: 284, published: 248, avgRating: 4.6 },
  },
  {
    id: 'enrollment-report',
    title: 'Enrollment Report',
    description: 'Detailed enrollment analytics with progress and completion tracking.',
    icon: 'UserCheck',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    stats: { total: 38291, completed: 9453, dropRate: '4.2%' },
  },
  {
    id: 'revenue-report',
    title: 'Revenue Report',
    description: 'Financial overview with revenue trends, top courses, and growth metrics.',
    icon: 'IndianRupee',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    stats: { total: '₹2.4Cr', monthly: '₹18.5L', growth: '+22%' },
  },
  {
    id: 'certificate-report',
    title: 'Certificate Report',
    description: 'Certificate issuance tracking with verification and download statistics.',
    icon: 'Award',
    gradient: 'linear-gradient(135deg, #f59e0b, #fb923c)',
    stats: { issued: 9453, pending: 342, downloaded: 8920 },
  },
  {
    id: 'support-report',
    title: 'Support Report',
    description: 'Support ticket analysis with response times and resolution metrics.',
    icon: 'Headphones',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    stats: { total: 2847, resolved: 2301, avgTime: '4.2h' },
  },
];

export const exportFormats = [
  { id: 'pdf', label: 'Export PDF', icon: 'FileText', color: '#ef4444' },
  { id: 'excel', label: 'Export Excel', icon: 'FileSpreadsheet', color: '#10b981' },
  { id: 'csv', label: 'Export CSV', icon: 'FileDown', color: '#3b82f6' },
];
