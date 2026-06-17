import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { coursesData } from "../../../backend/coursesData";
import CourseModal from "../Courses/CourseModal";
import CourseCard from "../Courses/CourseCard";
import { getPurchasedCourses } from "../../services/paymentService";

function UserDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [completedSyllabusItems, setCompletedSyllabusItems] = useState({});
  const [activeCourse, setActiveCourse] = useState(null);

  // Authentication check & state sync
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role === "teacher") {
      navigate("/teacher");
      return;
    }
    setCurrentUser(user);

    // Sync courses from localStorage (merge with defaults)
    const storedCourses = localStorage.getItem("all_courses");
    if (storedCourses) {
      try {
        const parsed = JSON.parse(storedCourses);
        const merged = coursesData.map((defaultCourse) => {
          const stored = parsed.find((c) => c.title === defaultCourse.title);
          if (stored) {
            return { ...defaultCourse, ...stored };
          }
          return defaultCourse;
        });
        const extraCourses = parsed.filter(
          (c) => !coursesData.some((d) => d.title === c.title)
        );
        const result = [...merged, ...extraCourses];
        setCourses(result);
        localStorage.setItem("all_courses", JSON.stringify(result));
      } catch (e) {
        console.error("Failed to parse stored courses", e);
        localStorage.setItem("all_courses", JSON.stringify(coursesData));
        setCourses(coursesData);
      }
    } else {
      localStorage.setItem("all_courses", JSON.stringify(coursesData));
      setCourses(coursesData);
    }

    // Sync enrolled
    const storedEnrolled = localStorage.getItem(`enrolled_courses_${user.email}`);
    if (storedEnrolled) {
      setEnrolled(JSON.parse(storedEnrolled));
    }

    // Sync purchased
    const storedPurchased = getPurchasedCourses(user.email);
    setPurchased(storedPurchased);

    // Sync favorites
    const storedFavorites = localStorage.getItem(`fav_courses_${user.email}`);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    // Sync progress
    const storedProgress = localStorage.getItem(`syllabus_progress_${user.email}`);
    if (storedProgress) {
      setCompletedSyllabusItems(JSON.parse(storedProgress));
    }
  }, [navigate]);

  // Handle updates made inside modal
  const handleActiveCourseUpdate = (course) => {
    setActiveCourse(course);
    
    // Refresh states from localStorage to display real-time updates in dashboard
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const storedEnrolled = localStorage.getItem(`enrolled_courses_${user.email}`);
      if (storedEnrolled) setEnrolled(JSON.parse(storedEnrolled));
      
      const storedPurchased = getPurchasedCourses(user.email);
      setPurchased(storedPurchased);

      const storedProgress = localStorage.getItem(`syllabus_progress_${user.email}`);
      if (storedProgress) setCompletedSyllabusItems(JSON.parse(storedProgress));
    }
  };

  const handlePurchaseSuccess = (courseTitle) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const updated = getPurchasedCourses(user.email);
      setPurchased(updated);
      if (!enrolled.includes(courseTitle)) {
        setEnrolled([...enrolled, courseTitle]);
      }
    }
  };

  // Toggle favorite
  const toggleFavorite = (courseTitle, e) => {
    e.stopPropagation();
    if (!currentUser) return;
    let updatedFavorites;
    if (favorites.includes(courseTitle)) {
      updatedFavorites = favorites.filter((title) => title !== courseTitle);
    } else {
      updatedFavorites = [...favorites, courseTitle];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(`fav_courses_${currentUser.email}`, JSON.stringify(updatedFavorites));
  };

  // Toggle enrollment
  const toggleEnroll = (courseTitle) => {
    if (!currentUser) return;
    let updatedEnrolled;
    
    const globalEnrollmentsStr = localStorage.getItem("global_enrollments");
    const globalEnrollments = globalEnrollmentsStr ? JSON.parse(globalEnrollmentsStr) : {};
    globalEnrollments[courseTitle] = globalEnrollments[courseTitle] || [];

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
        localStorage.setItem(`syllabus_progress_${currentUser.email}`, JSON.stringify(updatedProgress));

        // Update global enrollments mapping
        globalEnrollments[courseTitle] = globalEnrollments[courseTitle].filter(email => email.toLowerCase() !== currentUser.email.toLowerCase());
      } else {
        return;
      }
    } else {
      updatedEnrolled = [...enrolled, courseTitle];
      // Update global enrollments mapping
      if (!globalEnrollments[courseTitle].some(email => email.toLowerCase() === currentUser.email.toLowerCase())) {
        globalEnrollments[courseTitle].push(currentUser.email);
      }
    }
    setEnrolled(updatedEnrolled);
    localStorage.setItem(`enrolled_courses_${currentUser.email}`, JSON.stringify(updatedEnrolled));
    localStorage.setItem("global_enrollments", JSON.stringify(globalEnrollments));
  };

  // Toggle syllabus checklist item
  const toggleSyllabusItem = (courseTitle, itemIndex) => {
    if (!currentUser) return;
    const key = `${courseTitle}-${itemIndex}`;
    const updatedProgress = {
      ...completedSyllabusItems,
      [key]: !completedSyllabusItems[key],
    };
    setCompletedSyllabusItems(updatedProgress);
    localStorage.setItem(`syllabus_progress_${currentUser.email}`, JSON.stringify(updatedProgress));
  };

  // Get completed count helper
  const getCompletedCount = (courseTitle, syllabusArray = []) => {
    return syllabusArray.reduce((acc, _, idx) => {
      return acc + (completedSyllabusItems[`${courseTitle}-${idx}`] ? 1 : 0);
    }, 0);
  };

  if (!currentUser) return null;

  // Only show purchased courses as enrolled (no free enrollment)
  const enrolledCourses = courses.filter((c) => purchased.includes(c.title));
  const favoriteCourses = courses.filter((c) => favorites.includes(c.title));

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        {/* Floating gradient orbs */}
        <div className="orb orb-1" style={{ top: "-10%", right: "-10%" }}></div>
        <div className="orb orb-2" style={{ bottom: "-10%", left: "-10%" }}></div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar Profile Card */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">👨‍🎓</div>
          <h3>{currentUser.name}</h3>
          <p className="profile-email">{currentUser.email}</p>
          <span className="profile-badge">Student</span>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-val">{enrolledCourses.length}</span>
              <span className="stat-lbl">Enrolled</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{favoriteCourses.length}</span>
              <span className="stat-lbl">Favorites</span>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="dashboard-content">
          <div className="dashboard-header-row">
            <h2>Welcome Back, {currentUser.name.split(" ")[0]}!</h2>
          </div>

          {/* Purchased Courses (only after real payment) */}
          <section>
            <h3 className="dashboard-section-title">
              <span>📺</span> My Video Courses
            </h3>
            {enrolledCourses.length > 0 ? (
              <div className="dashboard-card-grid">
                  {enrolledCourses.map((course, idx) => {
                  const completed = getCompletedCount(course.title, course.syllabus);
                  const percentage = Math.round((completed / course.syllabus.length) * 100);

                  return (
                    <CourseCard
                      key={idx}
                      course={course}
                      isFav={favorites.includes(course.title)}
                      isEnrolled={true}
                      isPurchased={true}
                      completedCount={completed}
                      progressPercentage={percentage}
                      toggleFavorite={toggleFavorite}
                      setActiveCourse={handleActiveCourseUpdate}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty-dashboard-state">
                <div className="emoji">🎬</div>
                <h4>No Purchased Courses</h4>
                <p>Buy a course to start watching videos and tracking your progress!</p>
                <button className="admin-action-btn" onClick={() => navigate("/courses")}>
                  Browse Courses
                </button>
              </div>
            )}
          </section>

          {/* Favorite Courses Grid */}
          <section style={{ marginTop: "20px" }}>
            <h3 className="dashboard-section-title">
              <span>💖</span> Favorite Courses
            </h3>
            {favoriteCourses.length > 0 ? (
              <div className="dashboard-card-grid">
                {favoriteCourses.map((course, idx) => {
                  const isEnrolled = enrolled.includes(course.title);
                  const isPurchased = purchased.includes(course.title);
                  const completed = getCompletedCount(course.title, course.syllabus);
                  const percentage = Math.round((completed / course.syllabus.length) * 100);

                  return (
                    <CourseCard
                      key={idx}
                      course={course}
                      isFav={true}
                      isEnrolled={isEnrolled}
                      isPurchased={isPurchased}
                      completedCount={completed}
                      progressPercentage={percentage}
                      toggleFavorite={toggleFavorite}
                      setActiveCourse={handleActiveCourseUpdate}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty-dashboard-state">
                <div className="emoji">⭐</div>
                <h4>No Favorites Yet</h4>
                <p>Bookmark courses you like to view them quickly on your dashboard.</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Reused Detail Modal */}
      {activeCourse && (
        <CourseModal
          activeCourse={activeCourse}
          setActiveCourse={(val) => {
            setActiveCourse(val);
            // Re-read progress on close
            if (currentUser) {
              const storedProgress = localStorage.getItem(`syllabus_progress_${currentUser.email}`);
              if (storedProgress) setCompletedSyllabusItems(JSON.parse(storedProgress));
              const storedEnrolled = localStorage.getItem(`enrolled_courses_${currentUser.email}`);
              if (storedEnrolled) setEnrolled(JSON.parse(storedEnrolled));
              const storedPurchased = getPurchasedCourses(currentUser.email);
              setPurchased(storedPurchased);
            }
          }}
          enrolled={enrolled}
          purchased={purchased}
          completedSyllabusItems={completedSyllabusItems}
          toggleEnroll={toggleEnroll}
          toggleSyllabusItem={toggleSyllabusItem}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}

export default UserDashboard;
