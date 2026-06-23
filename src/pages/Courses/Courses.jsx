import React, { useState, useEffect } from "react";
import "./Courses.css";
import { coursesData } from "../../coursesData";

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [completedSyllabusItems, setCompletedSyllabusItems] = useState({});
  const [sortBy, setSortBy] = useState("default");
  const [activeCourse, setActiveCourse] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

  // Load preferences from localstorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("fav_courses");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      const storedEnrolled = localStorage.getItem("enrolled_courses");
      if (storedEnrolled) {
        setEnrolled(JSON.parse(storedEnrolled));
      }

      const storedProgress = localStorage.getItem("syllabus_progress");
      if (storedProgress) {
        setCompletedSyllabusItems(JSON.parse(storedProgress));
      }
    } catch (e) {
      console.error("Failed to load user progress", e);
    }
  }, []);

  // Sync favorites
  const toggleFavorite = (courseTitle, e) => {
    e.stopPropagation();
    let updatedFavorites;
    if (favorites.includes(courseTitle)) {
      updatedFavorites = favorites.filter((title) => title !== courseTitle);
    } else {
      updatedFavorites = [...favorites, courseTitle];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("fav_courses", JSON.stringify(updatedFavorites));
  };

  // Toggle enrollment
  const toggleEnroll = (courseTitle) => {
    let updatedEnrolled;
    if (enrolled.includes(courseTitle)) {
      if (window.confirm(`Are you sure you want to leave ${courseTitle}? Your progress will be reset.`)) {
        updatedEnrolled = enrolled.filter((title) => title !== courseTitle);
        // Clear progress for this course
        const updatedProgress = { ...completedSyllabusItems };
        Object.keys(updatedProgress).forEach((key) => {
          if (key.startsWith(`${courseTitle}-`)) {
            delete updatedProgress[key];
          }
        });
        setCompletedSyllabusItems(updatedProgress);
        localStorage.setItem("syllabus_progress", JSON.stringify(updatedProgress));
      } else {
        return;
      }
    } else {
      updatedEnrolled = [...enrolled, courseTitle];
    }
    setEnrolled(updatedEnrolled);
    localStorage.setItem("enrolled_courses", JSON.stringify(updatedEnrolled));
  };

  // Toggle syllabus checklist item
  const toggleSyllabusItem = (courseTitle, itemIndex) => {
    const key = `${courseTitle}-${itemIndex}`;
    const updatedProgress = {
      ...completedSyllabusItems,
      [key]: !completedSyllabusItems[key],
    };
    setCompletedSyllabusItems(updatedProgress);
    localStorage.setItem("syllabus_progress", JSON.stringify(updatedProgress));
  };

  // Get completed syllabus count
  const getCompletedCount = (courseTitle, syllabusArray) => {
    return syllabusArray.reduce((acc, _, idx) => {
      return acc + (completedSyllabusItems[`${courseTitle}-${idx}`] ? 1 : 0);
    }, 0);
  };

  // Filter & Sort Logic
  const getProcessedCourses = () => {
    // 1. Filter
    const filtered = coursesData.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel =
        selectedLevel === "All" ||
        course.level.toLowerCase().includes(selectedLevel.toLowerCase());

      const matchesFavorite = !showOnlyFavorites || favorites.includes(course.title);
      const matchesEnrolled = !showOnlyEnrolled || enrolled.includes(course.title);

      return matchesSearch && matchesLevel && matchesFavorite && matchesEnrolled;
    });

    // 2. Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "duration") {
      const getMonths = (durationStr) => {
        const val = parseInt(durationStr);
        return isNaN(val) ? 999 : val;
      };
      filtered.sort((a, b) => getMonths(a.duration) - getMonths(b.duration));
    }

    return filtered;
  };

  const processedCourses = getProcessedCourses();

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>IT Courses</h1>
        <p>Comprehensive, state-of-the-art training programs to accelerate your tech career</p>
      </div>

      {/* Search and Filters Section */}
      <div className="search-filter-container">
        <div className="search-sort-row">
          <div className="search-bar-wrapper">
            <svg
              className="search-icon-svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search courses, skills, tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-wrapper">
            <span className="sort-label">Sort:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Recommended</option>
              <option value="name">Alphabetical (A-Z)</option>
              <option value="duration">Duration (Shortest)</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          {/* Level Filter Chips */}
          <div className="filter-chips">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                className={`filter-chip ${selectedLevel === level ? "active" : ""}`}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Favorites & Enrolled Toggles */}
          <div className="toggles-group">
            <div
              className="favorites-toggle-wrapper"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            >
              <input
                type="checkbox"
                className="favorites-checkbox"
                checked={showOnlyFavorites}
                onChange={() => {}}
              />
              <span className="favorites-label">
                Favorites ({favorites.length})
              </span>
            </div>

            <div
              className="favorites-toggle-wrapper"
              onClick={() => setShowOnlyEnrolled(!showOnlyEnrolled)}
            >
              <input
                type="checkbox"
                className="favorites-checkbox enrolled-checkbox"
                checked={showOnlyEnrolled}
                onChange={() => {}}
              />
              <span className="favorites-label">
                My Enrolled ({enrolled.length})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {processedCourses.length > 0 ? (
          processedCourses.map((course, index) => {
            const isFav = favorites.includes(course.title);
            const isEnrolled = enrolled.includes(course.title);
            const completedCount = getCompletedCount(course.title, course.syllabus);
            const progressPercentage = Math.round(
              (completedCount / course.syllabus.length) * 100
            );

            return (
              <div
                className={`course-card ${isEnrolled ? "enrolled" : ""}`}
                key={index}
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
          })
        ) : (
          <div className="no-results">
            <div className="no-results-emoji">🔍</div>
            <h3>No Courses Found</h3>
            <p>Try adjusting your search terms or filter selections.</p>
          </div>
        )}
      </div>

      {/* Glassmorphic Modal for Course Details */}
      {activeCourse && (() => {
        const isEnrolled = enrolled.includes(activeCourse.title);
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
      })()}
    </div>
  );
}

export default Courses;
