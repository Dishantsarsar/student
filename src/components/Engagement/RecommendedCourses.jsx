import React from 'react';
import { coursesData } from '../../coursesData';
import './Engagement.css';

function RecommendedCourses({ onCourseClick, type = 'recommended', title, subtitle }) {
  // Determine list based on type
  let list = [...coursesData];
  let defaultTitle = "🎯 Recommended for You";
  let defaultSubtitle = "Hand-picked courses based on your interests.";
  let badgeText = "Top Pick";

  if (type === 'trending') {
    list = list.sort(() => 0.5 - Math.random()).slice(0, 3); // mock trending
    defaultTitle = "🔥 Trending Now";
    defaultSubtitle = "See what other students are learning this week.";
    badgeText = "Trending";
  } else if (type === 'top-rated') {
    list = list.filter(c => parseFloat(c.rating || "4.8") >= 4.8).slice(0, 3);
    defaultTitle = "⭐ Top Rated";
    defaultSubtitle = "Highest rated courses by our alumni.";
    badgeText = "Top Rated";
  } else if (type === 'newest') {
    list = list.slice(list.length - 3).reverse();
    defaultTitle = "✨ Newest Additions";
    defaultSubtitle = "Fresh content just added to the platform.";
    badgeText = "New";
  } else {
    // default recommended
    list = list.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  return (
    <div className="recommended-courses-section">
      <div className="section-header">
        <h2 className="section-title-gradient">{title || defaultTitle}</h2>
        <p className="section-subtitle-center">{subtitle || defaultSubtitle}</p>
      </div>
      <div className="courses-grid recommended-grid">
        {list.map((course, index) => (
          <div 
            key={index}
            className="course-card interactive hover-glow"
            onClick={() => onCourseClick(course)}
          >
            <div className="card-top">
              <div className="course-icon-badge-row">
                <div className="course-icon">{course.emoji}</div>
                <span className="recommended-badge">{badgeText}</span>
              </div>
            </div>
            <div className="course-info-wrapper">
              <h3>{course.title}</h3>
              <p className="course-desc">{course.description}</p>
            </div>
            <div className="course-meta">
              <span className="meta-item"><strong>Duration:</strong> {course.duration}</span>
              <span className="meta-item"><strong>Level:</strong> {course.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedCourses;
