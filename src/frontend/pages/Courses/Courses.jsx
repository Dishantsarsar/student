import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import { coursesData } from "../../../backend/coursesData";
import FilterSection from "./FilterSection";
import CourseCard from "./CourseCard";
import CourseModal from "./CourseModal";
import { getPurchasedCourses } from "../../services/paymentService";

function Courses() {
  const navigate = useNavigate();
  const [courses] = useState(() => {
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
        localStorage.setItem("all_courses", JSON.stringify(result));
        return result;
      } catch (e) {
        console.error("Failed to parse stored courses", e);
      }
    }
    localStorage.setItem("all_courses", JSON.stringify(coursesData));
    return coursesData;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [completedSyllabusItems, setCompletedSyllabusItems] = useState({});
  const [sortBy, setSortBy] = useState("default");
  const [activeCourse, setActiveCourse] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

  // Load preferences from localstorage on mount
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        
        const storedFavorites = localStorage.getItem(`fav_courses_${currentUser.email}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        const storedEnrolled = localStorage.getItem(`enrolled_courses_${currentUser.email}`);
        if (storedEnrolled) {
          setEnrolled(JSON.parse(storedEnrolled));
        }

        const storedPurchased = getPurchasedCourses(currentUser.email);
        setPurchased(storedPurchased);

        const storedProgress = localStorage.getItem(`syllabus_progress_${currentUser.email}`);
        if (storedProgress) {
          setCompletedSyllabusItems(JSON.parse(storedProgress));
        }
      }
    } catch (e) {
      console.error("Failed to load user progress", e);
    }
  }, []);

  // Sync favorites
  const toggleFavorite = (courseTitle, e) => {
    e.stopPropagation();
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please sign in to favorite courses.");
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    const currentUser = JSON.parse(userStr);
    let updatedFavorites;
    if (favorites.includes(courseTitle)) {
      updatedFavorites = favorites.filter((title) => title !== courseTitle);
    } else {
      updatedFavorites = [...favorites, courseTitle];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(`fav_courses_${currentUser.email}`, JSON.stringify(updatedFavorites));
  };

  // Refresh purchased courses after a purchase
  const handlePurchaseSuccess = (courseTitle) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      const updated = getPurchasedCourses(currentUser.email);
      setPurchased(updated);
      if (!enrolled.includes(courseTitle)) {
        setEnrolled([...enrolled, courseTitle]);
      }
    }
  };

  // Toggle enrollment
  const toggleEnroll = (courseTitle) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please sign in to enroll in courses.");
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    const currentUser = JSON.parse(userStr);
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
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const currentUser = JSON.parse(userStr);

    const key = `${courseTitle}-${itemIndex}`;
    const updatedProgress = {
      ...completedSyllabusItems,
      [key]: !completedSyllabusItems[key],
    };
    setCompletedSyllabusItems(updatedProgress);
    localStorage.setItem(`syllabus_progress_${currentUser.email}`, JSON.stringify(updatedProgress));
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
    const filtered = courses.filter((course) => {
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
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        showOnlyEnrolled={showOnlyEnrolled}
        setShowOnlyEnrolled={setShowOnlyEnrolled}
        favoritesCount={favorites.length}
        enrolledCount={enrolled.length}
      />

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

            const isPurchased = purchased.includes(course.title);

            return (
                <CourseCard
                  key={index}
                  course={course}
                  isFav={isFav}
                  isEnrolled={isEnrolled}
                  isPurchased={isPurchased}
                  completedCount={completedCount}
                  progressPercentage={progressPercentage}
                  toggleFavorite={toggleFavorite}
                  setActiveCourse={setActiveCourse}
                />
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
      <CourseModal
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
        enrolled={enrolled}
        purchased={purchased}
        completedSyllabusItems={completedSyllabusItems}
        toggleEnroll={toggleEnroll}
        toggleSyllabusItem={toggleSyllabusItem}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}

export default Courses;

