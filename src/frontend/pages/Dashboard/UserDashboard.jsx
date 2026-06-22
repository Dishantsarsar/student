import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./DashboardStyles.css";
import { coursesData } from "../../../backend/coursesData";
import CourseModal from "../Courses/CourseModal";
import { getPurchasedCourses } from "../../services/paymentService";

/* ── Dashboard Section Components ── */
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHome from "./components/DashboardHome";
import DashboardCourses from "./components/DashboardCourses";
import DashboardAnalytics from "./components/DashboardAnalytics";
import DashboardAchievements from "./components/DashboardAchievements";
import DashboardCertificates from "./components/DashboardCertificates";
import DashboardWishlist from "./components/DashboardWishlist";
import DashboardSettings from "./components/DashboardSettings";
import ComingSoonSection from "./components/ComingSoonSection";

function UserDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [completedSyllabusItems, setCompletedSyllabusItems] = useState({});
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  // Authentication check & state sync (UNCHANGED from original)
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
          if (stored) return { ...defaultCourse, ...stored };
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
    if (storedEnrolled) setEnrolled(JSON.parse(storedEnrolled));

    // Sync purchased
    const storedPurchased = getPurchasedCourses(user.email);
    setPurchased(storedPurchased);

    // Sync favorites
    const storedFavorites = localStorage.getItem(`fav_courses_${user.email}`);
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

    // Sync progress
    const storedProgress = localStorage.getItem(`syllabus_progress_${user.email}`);
    if (storedProgress) setCompletedSyllabusItems(JSON.parse(storedProgress));
  }, [navigate]);

  // Handle updates made inside modal (UNCHANGED)
  const handleActiveCourseUpdate = (course) => {
    setActiveCourse(course);
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
      if (!enrolled.includes(courseTitle)) setEnrolled([...enrolled, courseTitle]);
    }
  };

  // Toggle favorite (UNCHANGED)
  const toggleFavorite = (courseTitle, e) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updatedFavorites = favorites.includes(courseTitle)
      ? favorites.filter((t) => t !== courseTitle)
      : [...favorites, courseTitle];
    setFavorites(updatedFavorites);
    localStorage.setItem(`fav_courses_${currentUser.email}`, JSON.stringify(updatedFavorites));
  };

  // Toggle enrollment (UNCHANGED)
  const toggleEnroll = (courseTitle) => {
    if (!currentUser) return;
    const globalEnrollmentsStr = localStorage.getItem("global_enrollments");
    const globalEnrollments = globalEnrollmentsStr ? JSON.parse(globalEnrollmentsStr) : {};
    globalEnrollments[courseTitle] = globalEnrollments[courseTitle] || [];
    let updatedEnrolled;

    if (enrolled.includes(courseTitle)) {
      if (window.confirm(`Are you sure you want to leave ${courseTitle}? Your progress will be reset.`)) {
        updatedEnrolled = enrolled.filter((t) => t !== courseTitle);
        const updatedProgress = { ...completedSyllabusItems };
        Object.keys(updatedProgress).forEach((key) => {
          if (key.startsWith(`${courseTitle}-`)) delete updatedProgress[key];
        });
        setCompletedSyllabusItems(updatedProgress);
        localStorage.setItem(`syllabus_progress_${currentUser.email}`, JSON.stringify(updatedProgress));
        globalEnrollments[courseTitle] = globalEnrollments[courseTitle].filter(
          (email) => email.toLowerCase() !== currentUser.email.toLowerCase()
        );
      } else return;
    } else {
      updatedEnrolled = [...enrolled, courseTitle];
      if (!globalEnrollments[courseTitle].some((e) => e.toLowerCase() === currentUser.email.toLowerCase())) {
        globalEnrollments[courseTitle].push(currentUser.email);
      }
    }

    setEnrolled(updatedEnrolled);
    localStorage.setItem(`enrolled_courses_${currentUser.email}`, JSON.stringify(updatedEnrolled));
    localStorage.setItem("global_enrollments", JSON.stringify(globalEnrollments));
  };

  // Toggle syllabus checklist item (UNCHANGED)
  const toggleSyllabusItem = (courseTitle, itemIndex) => {
    if (!currentUser) return;
    const key = `${courseTitle}-${itemIndex}`;
    const updatedProgress = { ...completedSyllabusItems, [key]: !completedSyllabusItems[key] };
    setCompletedSyllabusItems(updatedProgress);
    localStorage.setItem(`syllabus_progress_${currentUser.email}`, JSON.stringify(updatedProgress));
  };

  if (!currentUser) return null;

  // Derived data
  const enrolledCourses = courses.filter((c) => purchased.includes(c.title));
  const favoriteCourses = courses.filter((c) => favorites.includes(c.title));

  /* ── Render Active Section ── */
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <DashboardHome
            currentUser={currentUser}
            enrolledCourses={enrolledCourses}
            favoriteCourses={favoriteCourses}
            completedSyllabusItems={completedSyllabusItems}
            setActiveSection={setActiveSection}
          />
        );
      case "courses":
        return (
          <DashboardCourses
            enrolledCourses={enrolledCourses}
            favoriteCourses={favoriteCourses}
            completedSyllabusItems={completedSyllabusItems}
            toggleFavorite={toggleFavorite}
            setActiveCourse={handleActiveCourseUpdate}
          />
        );
      case "analytics":
        return (
          <DashboardAnalytics
            enrolledCourses={enrolledCourses}
            completedSyllabusItems={completedSyllabusItems}
          />
        );
      case "achievements":
        return <DashboardAchievements />;
      case "certificates":
        return (
          <DashboardCertificates
            enrolledCourses={enrolledCourses}
            completedSyllabusItems={completedSyllabusItems}
          />
        );
      case "wishlist":
        return (
          <DashboardWishlist
            favoriteCourses={favoriteCourses}
            enrolledCourses={enrolledCourses}
            purchased={purchased}
            toggleFavorite={toggleFavorite}
            setActiveCourse={handleActiveCourseUpdate}
          />
        );
      case "settings":
        return <DashboardSettings currentUser={currentUser} />;
      case "assignments":
      case "projects":
      case "calendar":
      case "community":
      case "career":
        return <ComingSoonSection section={activeSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="new-dashboard-page">
      {/* Background */}
      <div className="new-dashboard-bg">
        <div className="nd-orb nd-orb1" />
        <div className="nd-orb nd-orb2" />
        <div className="nd-orb nd-orb3" />
      </div>

      <div className="new-dashboard-layout">
        {/* Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          currentUser={currentUser}
          enrolledCount={enrolledCourses.length}
        />

        {/* Main Content */}
        <main className="new-dashboard-main">
          <div className="new-dashboard-content">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Reused Detail Modal (UNCHANGED) */}
      {activeCourse && (
        <CourseModal
          activeCourse={activeCourse}
          setActiveCourse={(val) => {
            setActiveCourse(val);
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
