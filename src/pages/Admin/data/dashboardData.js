// ============================================
// SOLUTION ADDA — Dashboard Mock Data
// ============================================

export const dashboardStats = [
  {
    id: 'total-students',
    label: 'Total Students',
    value: 12847,
    trend: '+12.5%',
    trendDirection: 'up',
    icon: 'Users',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
  },
  {
    id: 'total-courses',
    label: 'Total Courses',
    value: 284,
    trend: '+8.2%',
    trendDirection: 'up',
    icon: 'BookOpen',
    gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
  },
  {
    id: 'categories',
    label: 'Categories',
    value: 42,
    trend: '+3.1%',
    trendDirection: 'up',
    icon: 'Grid3x3',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
  },
  {
    id: 'enrollments',
    label: 'Enrollments',
    value: 38291,
    trend: '+18.7%',
    trendDirection: 'up',
    icon: 'UserCheck',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    value: 9453,
    trend: '+5.4%',
    trendDirection: 'up',
    icon: 'Award',
    gradient: 'linear-gradient(135deg, #f59e0b, #fb923c)',
  },
  {
    id: 'active-students',
    label: 'Active Students',
    value: 8721,
    trend: '-2.1%',
    trendDirection: 'down',
    icon: 'Activity',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)',
  },
];

export const studentGrowthData = {
  title: 'Student Growth',
  subtitle: 'Monthly registration trend',
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  data: [420, 580, 710, 890, 1050, 1240, 1180, 1390, 1520, 1680, 1840, 2100],
  color: '#6366f1',
};

export const coursePopularityData = {
  title: 'Course Popularity',
  subtitle: 'Top categories by enrollment',
  items: [
    { label: 'Web Development', value: 35, color: '#6366f1' },
    { label: 'Data Science', value: 25, color: '#8b5cf6' },
    { label: 'Mobile Dev', value: 18, color: '#06b6d4' },
    { label: 'AI / ML', value: 14, color: '#10b981' },
    { label: 'Others', value: 8, color: '#f59e0b' },
  ],
};

export const enrollmentTrendData = {
  title: 'Enrollment Trend',
  subtitle: 'Weekly enrollment activity',
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [145, 230, 198, 310, 278, 390, 220],
  color: '#22d3ee',
};

export const quickActions = [
  {
    id: 'add-course',
    title: 'Add Course',
    description: 'Create a new course',
    icon: 'Plus',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    link: '/admin/courses',
  },
  {
    id: 'add-category',
    title: 'Add Category',
    description: 'Create new category',
    icon: 'FolderPlus',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    link: '/admin/categories',
  },
  {
    id: 'view-students',
    title: 'View Students',
    description: 'Manage all students',
    icon: 'Users',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    link: '/admin/students',
  },
  {
    id: 'generate-report',
    title: 'Generate Report',
    description: 'Create analytics report',
    icon: 'FileText',
    gradient: 'linear-gradient(135deg, #f59e0b, #fb923c)',
    link: '/admin/reports',
  },
];

export const recentStudents = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@email.com', course: 'Web Development', date: '2 hours ago' },
  { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', course: 'Data Science', date: '4 hours ago' },
  { id: 3, name: 'Rahul Verma', email: 'rahul.verma@email.com', course: 'Machine Learning', date: '6 hours ago' },
  { id: 4, name: 'Sneha Patel', email: 'sneha.patel@email.com', course: 'Cloud Computing', date: '8 hours ago' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@email.com', course: 'Cyber Security', date: '12 hours ago' },
];

export const recentCourses = [
  { id: 1, title: 'React Advanced Patterns', category: 'Web Development', students: 142, status: 'published' },
  { id: 2, title: 'Python for Data Science', category: 'Data Science', students: 98, status: 'published' },
  { id: 3, title: 'AWS Solutions Architect', category: 'Cloud Computing', students: 76, status: 'draft' },
  { id: 4, title: 'Flutter Mobile Dev', category: 'Mobile Development', students: 54, status: 'published' },
  { id: 5, title: 'Ethical Hacking 101', category: 'Cyber Security', students: 88, status: 'review' },
];

export const recentReviews = [
  { id: 1, student: 'Ananya Roy', course: 'Web Development', rating: 5, comment: 'Excellent course content and structure!', date: '1 hour ago' },
  { id: 2, student: 'Karan Joshi', course: 'Data Science', rating: 4, comment: 'Great explanations, needs more projects.', date: '3 hours ago' },
  { id: 3, student: 'Meera Nair', course: 'Machine Learning', rating: 5, comment: 'Best ML course I have ever taken!', date: '5 hours ago' },
  { id: 4, student: 'Dev Patel', course: 'DevOps', rating: 3, comment: 'Good but could use more hands-on labs.', date: '8 hours ago' },
];

export const pendingSupport = [
  { id: 'TKT-1001', student: 'Ravi Kumar', subject: 'Cannot access course material', priority: 'high', status: 'open', date: '30 min ago' },
  { id: 'TKT-1002', student: 'Sanya Gupta', subject: 'Payment not reflecting', priority: 'urgent', status: 'open', date: '1 hour ago' },
  { id: 'TKT-1003', student: 'Amit Shah', subject: 'Certificate download issue', priority: 'medium', status: 'in-progress', date: '2 hours ago' },
  { id: 'TKT-1004', student: 'Pooja Reddy', subject: 'Wrong course enrolled', priority: 'high', status: 'open', date: '4 hours ago' },
];
