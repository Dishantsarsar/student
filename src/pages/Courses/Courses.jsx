import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import SectionReveal, { RevealItem } from '../../components/ui/SectionReveal';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
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

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("fav_courses");
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

      const storedEnrolled = localStorage.getItem("enrolled_courses");
      if (storedEnrolled) setEnrolled(JSON.parse(storedEnrolled));

      const storedProgress = localStorage.getItem("syllabus_progress");
      if (storedProgress) setCompletedSyllabusItems(JSON.parse(storedProgress));
    } catch (e) {
      console.error("Failed to load user progress", e);
    }
  }, []);

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

  const toggleEnroll = (courseTitle) => {
    let updatedEnrolled;
    if (enrolled.includes(courseTitle)) {
      if (window.confirm(`Are you sure you want to leave ${courseTitle}? Your progress will be reset.`)) {
        updatedEnrolled = enrolled.filter((title) => title !== courseTitle);
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

  const toggleSyllabusItem = (courseTitle, itemIndex) => {
    const key = `${courseTitle}-${itemIndex}`;
    const updatedProgress = {
      ...completedSyllabusItems,
      [key]: !completedSyllabusItems[key],
    };
    setCompletedSyllabusItems(updatedProgress);
    localStorage.setItem("syllabus_progress", JSON.stringify(updatedProgress));
  };

  const getCompletedCount = (courseTitle, syllabusArray) => {
    return syllabusArray.reduce((acc, _, idx) => {
      return acc + (completedSyllabusItems[`${courseTitle}-${idx}`] ? 1 : 0);
    }, 0);
  };

  const getProcessedCourses = () => {
    const filtered = coursesData.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === "All" || course.level.toLowerCase().includes(selectedLevel.toLowerCase());
      const matchesFavorite = !showOnlyFavorites || favorites.includes(course.title);
      const matchesEnrolled = !showOnlyEnrolled || enrolled.includes(course.title);
      return matchesSearch && matchesLevel && matchesFavorite && matchesEnrolled;
    });

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
    <div className="courses-page-premium">
      <AnimatedBackground variant="dynamic" />

      {/* Header */}
      <header className="courses-header-premium">
        <SectionReveal direction="down">
          <Badge variant="info" size="sm" className="mb-4">Explore Curriculum</Badge>
          <h1 className="hero-main-title">Premium <span className="text-gradient">IT Courses</span></h1>
          <p className="hero-subtitle">Comprehensive, state-of-the-art training programs to accelerate your tech career</p>
        </SectionReveal>
      </header>

      {/* Controls */}
      <section className="courses-controls-section">
        <SectionReveal direction="up" delay={0.1}>
          <GlassCard className="courses-filters-card">
            <div className="search-sort-flex">
              <div className="premium-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search courses, skills, tools..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="premium-sort-box">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Recommended</option>
                  <option value="name">Alphabetical (A-Z)</option>
                  <option value="duration">Duration (Shortest)</option>
                </select>
              </div>
            </div>

            <div className="filter-chips-flex">
              <div className="level-chips">
                {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button 
                    key={level} 
                    className={`level-chip ${selectedLevel === level ? "active" : ""}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="toggle-chips">
                <button 
                  className={`toggle-chip ${showOnlyFavorites ? 'active' : ''}`}
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                >
                  <span className="heart-icon">♥</span> Favorites ({favorites.length})
                </button>
                <button 
                  className={`toggle-chip ${showOnlyEnrolled ? 'active' : ''}`}
                  onClick={() => setShowOnlyEnrolled(!showOnlyEnrolled)}
                >
                  <span className="book-icon">📚</span> Enrolled ({enrolled.length})
                </button>
              </div>
            </div>
          </GlassCard>
        </SectionReveal>
      </section>

      {/* Grid */}
      <section className="courses-grid-section">
        <SectionReveal stagger={true} className="premium-courses-grid">
          {processedCourses.length > 0 ? (
            processedCourses.map((course, index) => {
              const isFav = favorites.includes(course.title);
              const isEnrolled = enrolled.includes(course.title);
              const completedCount = getCompletedCount(course.title, course.syllabus);
              const progressPercentage = Math.round((completedCount / course.syllabus.length) * 100);

              return (
                <RevealItem key={course.title}>
                  <GlassCard 
                    className={`premium-course-card ${isEnrolled ? 'is-enrolled' : ''}`} 
                    hover 
                    onClick={() => setActiveCourse(course)}
                  >
                    <div className="card-top-row">
                      <div className="course-emoji-box">{course.emoji}</div>
                      <div className="card-top-right">
                        {isEnrolled && <Badge variant="success" size="xs">Enrolled</Badge>}
                        <button 
                          className={`heart-btn ${isFav ? 'active' : ''}`} 
                          onClick={(e) => toggleFavorite(course.title, e)}
                        >
                          <svg viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-desc-trunc">{course.description}</p>
                    
                    {isEnrolled && (
                      <div className="card-progress-ui">
                        <div className="prog-text">
                          <span>Progress</span>
                          <span>{completedCount}/{course.syllabus.length}</span>
                        </div>
                        <div className="prog-bar-bg">
                          <div className="prog-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="card-meta-row">
                      <span className="meta-tag">⏱ {course.duration}</span>
                      <span className="meta-tag">📈 {course.level}</span>
                    </div>
                  </GlassCard>
                </RevealItem>
              );
            })
          ) : (
            <div className="empty-state-wrapper">
              <EmptyState 
                icon="🔍" 
                title="No Courses Found" 
                description="Try adjusting your search terms or filter selections to find what you're looking for." 
                actionLabel="Clear Filters"
                onAction={() => { setSearchTerm(''); setSelectedLevel('All'); setShowOnlyFavorites(false); setShowOnlyEnrolled(false); }}
              />
            </div>
          )}
        </SectionReveal>
      </section>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeCourse && (() => {
          const isEnrolled = enrolled.includes(activeCourse.title);
          const completedCount = getCompletedCount(activeCourse.title, activeCourse.syllabus);
          const progressPercentage = Math.round((completedCount / activeCourse.syllabus.length) * 100);

          return (
            <motion.div 
              className="premium-modal-backdrop" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActiveCourse(null)}
            >
              <motion.div 
                className="premium-modal course-detail-modal" 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }} 
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setActiveCourse(null)}>✕</button>
                
                <div className="course-modal-header">
                  <div className="course-emoji-box large">{activeCourse.emoji}</div>
                  <div>
                    <h2 className="modal-title">{activeCourse.title}</h2>
                    <div className="modal-meta-row">
                      <Badge variant="info">{activeCourse.level}</Badge>
                      <Badge variant="warning">{activeCourse.duration}</Badge>
                    </div>
                  </div>
                </div>

                <div className="course-modal-body scrollable">
                  <div className="modal-section-block">
                    <h4>About this Course</h4>
                    <p>{activeCourse.description}</p>
                  </div>

                  {isEnrolled && (
                    <div className="modal-progress-block">
                      <div className="prog-text">
                        <span>Syllabus Progress</span>
                        <strong className="text-cyan">{progressPercentage}% Completed</strong>
                      </div>
                      <div className="prog-bar-bg">
                        <div className="prog-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="modal-section-block">
                    <h4>Syllabus Details</h4>
                    <p className={`instruction-text ${!isEnrolled ? 'faded' : ''}`}>
                      {isEnrolled ? 'Click checklist items to mark them as completed:' : 'Enroll in this course to track your progress.'}
                    </p>
                    <ul className="premium-syllabus-list">
                      {activeCourse.syllabus.map((item, idx) => {
                        const isCompleted = !!completedSyllabusItems[`${activeCourse.title}-${idx}`];
                        return (
                          <li 
                            key={idx} 
                            className={`syll-item ${isCompleted ? 'completed' : ''} ${!isEnrolled ? 'locked' : ''}`}
                            onClick={() => isEnrolled && toggleSyllabusItem(activeCourse.title, idx)}
                          >
                            <div className="syll-check">
                              {isEnrolled ? (
                                <div className={`custom-chk ${isCompleted ? 'checked' : ''}`}>
                                  {isCompleted && '✓'}
                                </div>
                              ) : '⚡'}
                            </div>
                            <span className="syll-text">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="course-modal-footer">
                  {isEnrolled ? (
                    <Button 
                      variant="danger" 
                      onClick={() => { toggleEnroll(activeCourse.title); setActiveCourse(null); }}
                    >
                      Leave Course & Reset Progress
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={() => { toggleEnroll(activeCourse.title); }}
                    >
                      Enroll in Course
                    </Button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

export default Courses;
