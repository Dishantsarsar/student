import React from "react";

function CourseCard({
  course,
  isFav,
  isEnrolled,
  completedCount,
  progressPercentage,
  toggleFavorite,
  setActiveCourse,
}) {
  return (
    <div
      className={`course-card ${isEnrolled ? "enrolled" : ""}`}
      onClick={() => setActiveCourse(course)}
    >
      <div className="card-top">
        <div className="course-icon-badge-row">
          <div className="course-icon">{course.emoji}</div>
          {isEnrolled && <span className="enrolled-badge">Enrolled</span>}
        </div>
        <button
          className={`favorite-btn ${isFav ? "active" : ""}`}
          onClick={(e) => toggleFavorite(course.title, e)}
          aria-label="Add to favorites"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="course-info-wrapper">
        <h3>{course.title}</h3>
        <p className="course-desc">{course.description}</p>
      </div>

      {/* Progress Bar inside Card if Enrolled */}
      {isEnrolled && (
        <div className="card-progress-container">
          <div className="progress-text-row">
            <span>Course Progress</span>
            <span>
              {completedCount}/{course.syllabus.length} Tasks
            </span>
          </div>
          <div className="card-progress-bar-bg">
            <div
              className="card-progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="course-meta">
        <span className="meta-item">
          <strong>Duration:</strong> {course.duration}
        </span>
        <span className="meta-item">
          <strong>Level:</strong> {course.level}
        </span>
      </div>
    </div>
  );
}

export default CourseCard;
