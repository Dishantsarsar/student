// ============================================
// SOLUTION ADDA — Website Settings Mock Data
// ============================================

export const websiteSettings = {
  general: {
    siteName: 'Solution Adda',
    tagline: 'Learn. Build. Grow.',
    logo: null,
    favicon: null,
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  },
  contact: {
    email: 'support@solutionadda.com',
    phone: '+91 98765 43210',
    address: 'Tech Park, Whitefield, Bangalore, Karnataka 560066',
    supportEmail: 'help@solutionadda.com',
  },
  social: {
    facebook: 'https://facebook.com/solutionadda',
    twitter: 'https://twitter.com/solutionadda',
    instagram: 'https://instagram.com/solutionadda',
    linkedin: 'https://linkedin.com/company/solutionadda',
    youtube: 'https://youtube.com/@solutionadda',
    github: 'https://github.com/solutionadda',
  },
  footer: {
    copyrightText: '© 2025 Solution Adda. All rights reserved.',
    showSocialLinks: true,
    showNewsletter: true,
    columns: [
      { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
      { title: 'Resources', links: ['Documentation', 'Help Center', 'Community', 'Tutorials'] },
      { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'] },
    ],
  },
  hero: {
    title: 'Master the Skills of Tomorrow',
    subtitle: 'Join 12,000+ students learning cutting-edge technology courses from industry experts.',
    ctaText: 'Explore Courses',
    ctaLink: '/courses',
    backgroundImage: null,
    showStats: true,
  },
  seo: {
    metaTitle: 'Solution Adda - Premium Online Learning Platform',
    metaDescription: 'Learn Web Development, Data Science, Machine Learning, Cloud Computing and more with expert-led courses at Solution Adda.',
    metaKeywords: 'online courses, web development, data science, machine learning, solution adda, learn coding',
    ogImage: null,
    googleAnalyticsId: 'GA-XXXXXXXXX',
    sitemapEnabled: true,
  },
  theme: {
    mode: 'dark',
    fontFamily: 'Inter',
    borderRadius: 'rounded',
    enableAnimations: true,
    enableGlassmorphism: true,
  },
};
