import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../DashboardStyles.css';
import './DashboardWishlist.css';

function DashboardWishlist({ favoriteCourses, enrolledCourses, purchased, toggleFavorite, setActiveCourse }) {
  const navigate = useNavigate();

  return (
    <div className="dash-section dash-wishlist">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: 'rgba(244,114,182,0.12)' }}>❤️</span>
            Wishlist
          </h2>
          <p className="dash-section-subtitle">{favoriteCourses.length} saved courses</p>
        </div>
      </div>

      {favoriteCourses.length > 0 ? (
        <div className="wishlist-grid">
          {favoriteCourses.map((course, i) => {
            const isPurchased = purchased.includes(course.title);
            return (
              <div key={i} className="wishlist-card" onClick={() => setActiveCourse(course)}>
                <div className="wishlist-card-top">
                  <span className="wishlist-emoji">{course.emoji}</span>
                  <button
                    className="wishlist-remove-btn"
                    onClick={e => { e.stopPropagation(); toggleFavorite(course.title, e); }}
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>
                <div className="wishlist-card-info">
                  <div className="wishlist-course-name">{course.title}</div>
                  <div className="wishlist-course-desc">{course.description}</div>
                  <div className="wishlist-meta">
                    <span className="dash-badge amber">{course.level}</span>
                    <span className="wishlist-duration">⏱ {course.duration}</span>
                  </div>
                  {course.price && (
                    <div className="wishlist-price">₹{course.price.toLocaleString('en-IN')}</div>
                  )}
                </div>
                <div className="wishlist-actions">
                  {isPurchased ? (
                    <button
                      className="dash-btn primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={e => { e.stopPropagation(); navigate(`/watch/${encodeURIComponent(course.title)}`); }}
                    >
                      ▶ Resume Course
                    </button>
                  ) : (
                    <button
                      className="dash-btn ghost"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={e => { e.stopPropagation(); setActiveCourse(course); }}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dash-empty">
          <div className="dash-empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Browse our courses and click the heart icon to save courses you like</p>
          <button className="dash-btn primary" onClick={() => navigate('/courses')}>
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardWishlist;
