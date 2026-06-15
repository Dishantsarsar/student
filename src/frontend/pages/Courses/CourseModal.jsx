import React from "react";

function CourseModal({
  activeCourse,
  setActiveCourse,
  enrolled,
  completedSyllabusItems,
  toggleEnroll,
  toggleSyllabusItem,
}) {
  if (!activeCourse) return null;

  const isEnrolled = enrolled.includes(activeCourse.title);
  
  const getCompletedCount = (courseTitle, syllabusArray) => {
    return syllabusArray.reduce((acc, _, idx) => {
      return acc + (completedSyllabusItems[`${courseTitle}-${idx}`] ? 1 : 0);
    }, 0);
  };

  const completedCount = getCompletedCount(activeCourse.title, activeCourse.syllabus);
  const progressPercentage = Math.round(
    (completedCount / activeCourse.syllabus.length) * 100
  );

  return (
    <div className="modal-overlay" onClick={() => setActiveCourse(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setActiveCourse(null)}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          <div className="course-icon" style={{ transform: "none" }}>
            {activeCourse.emoji}
          </div>
          <div className="modal-title">
            <h2>{activeCourse.title}</h2>
            <p>
              {activeCourse.level} • {activeCourse.duration}
            </p>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4>About this Course</h4>
            <p>{activeCourse.description}</p>
          </div>

          {/* Progress bar in Modal if Enrolled */}
          {isEnrolled && (
            <div className="modal-progress-section">
              <div className="modal-progress-text">
                <span>Syllabus Progress Tracker</span>
                <strong>{progressPercentage}% Completed</strong>
              </div>
              <div className="modal-progress-bar-bg">
                <div
                  className="modal-progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="modal-section">
            <h4>Syllabus Details</h4>
            {isEnrolled ? (
              <p className="syllabus-instruction">
                Click checklist items to mark them as completed:
              </p>
            ) : (
              <p className="syllabus-instruction disabled">
                Enroll in this course to track your progress.
              </p>
            )}

            <ul className="syllabus-list interactive">
              {activeCourse.syllabus.map((item, idx) => {
                const isCompleted =
                  !!completedSyllabusItems[`${activeCourse.title}-${idx}`];
                return (
                  <li
                    key={idx}
                    className={`syllabus-item-interactive ${
                      isCompleted ? "completed" : ""
                    } ${!isEnrolled ? "disabled" : ""}`}
                    onClick={() => isEnrolled && toggleSyllabusItem(activeCourse.title, idx)}
                  >
                    {isEnrolled ? (
                      <div className="custom-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => {}}
                          className="syllabus-checkbox-input"
                        />
                        <span className="custom-checkbox-box"></span>
                      </div>
                    ) : (
                      <span className="syllabus-bullet-emoji">⚡</span>
                    )}
                    <span className="syllabus-item-text">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="modal-actions">
          {isEnrolled ? (
            <button
              className="enroll-btn leave-btn"
              onClick={() => {
                toggleEnroll(activeCourse.title);
                setActiveCourse(null);
              }}
            >
              Leave Course (Reset Progress)
            </button>
          ) : (
            <button
              className="enroll-btn"
              onClick={() => {
                toggleEnroll(activeCourse.title);
                alert(`Successfully Enrolled in ${activeCourse.title}! Happy learning!`);
              }}
            >
              Enroll in Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseModal;
