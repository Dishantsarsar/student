import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./WatchCourse.css";

function WatchCourse() {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    const user = JSON.parse(userStr);

    const storedCourses = localStorage.getItem("all_courses");
    if (!storedCourses) {
      navigate("/courses");
      return;
    }

    const allCourses = JSON.parse(storedCourses);
    const foundCourse = allCourses.find(
      (c) => c.title.toLowerCase() === decodeURIComponent(courseTitle).toLowerCase()
    );

    if (!foundCourse) {
      navigate("/courses");
      return;
    }

    setCourse(foundCourse);

    const purchased = JSON.parse(localStorage.getItem(`purchased_courses_${user.email}`) || "[]");
    const isPurchased = purchased.includes(foundCourse.title);

    if (!isPurchased) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, [courseTitle, navigate]);

  if (loading) {
    return (
      <div className="watch-course-page">
        <div className="loading-state">Loading course content...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="watch-course-page">
        <div className="unauthorized-state">
          <div className="lock-icon">🔒</div>
          <h2>Access Restricted</h2>
          <p>You have not purchased this course yet. Please purchase it to access video content.</p>
          <button className="back-btn" onClick={() => navigate("/courses")}>
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const video = course.videos?.[currentVideo];
  const hasVideos = course.videos && course.videos.length > 0;

  return (
    <div className="watch-course-page">
      <div className="watch-course-container">
        <div className="video-main-section">
          <div className="video-player-wrapper">
            {hasVideos && video ? (
              <iframe
                src={video.url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              ></iframe>
            ) : (
              <div className="no-video-placeholder">
                <span>🎬</span>
                <p>No video content available yet</p>
              </div>
            )}
          </div>
          <div className="video-info">
            <h2>{hasVideos ? video.title : course.title}</h2>
            <div className="video-meta-bar">
              <span className="video-duration">{hasVideos ? video.duration : "N/A"}</span>
              <span className="video-counter">
                Video {currentVideo + 1} of {hasVideos ? course.videos.length : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="playlist-section">
          <div className="playlist-header">
            <h3>Course Content</h3>
            <span className="playlist-count">{hasVideos ? course.videos.length : 0} videos</span>
          </div>
          <div className="playlist-videos">
            {hasVideos ? (
              course.videos.map((v, idx) => (
                <div
                  key={idx}
                  className={`playlist-item ${idx === currentVideo ? "active" : ""} ${
                    idx < currentVideo ? "watched" : ""
                  }`}
                  onClick={() => setCurrentVideo(idx)}
                >
                  <div className="playlist-item-index">
                    {idx < currentVideo ? "✅" : idx === currentVideo ? "▶️" : `0${idx + 1}`}
                  </div>
                  <div className="playlist-item-info">
                    <span className="playlist-item-title">{v.title}</span>
                    <span className="playlist-item-duration">{v.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-videos-msg">No videos available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchCourse;
