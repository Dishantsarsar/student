import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { processPayment } from "../../services/paymentService";

function CourseModal({
  activeCourse,
  setActiveCourse,
  enrolled,
  purchased,
  completedSyllabusItems,
  toggleEnroll,
  toggleSyllabusItem,
  onPurchaseSuccess,
}) {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  if (!activeCourse) return null;

  const isEnrolled = enrolled.includes(activeCourse.title);
  const isPurchased = purchased?.includes(activeCourse.title);

  const getCompletedCount = (courseTitle, syllabusArray) => {
    return syllabusArray.reduce((acc, _, idx) => {
      return acc + (completedSyllabusItems[`${courseTitle}-${idx}`] ? 1 : 0);
    }, 0);
  };

  const completedCount = getCompletedCount(activeCourse.title, activeCourse.syllabus);
  const progressPercentage = Math.round(
    (completedCount / activeCourse.syllabus.length) * 100
  );

  const handleBuyNow = async () => {
    if (!currentUser) {
      alert("Please sign in first.");
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    setPaying(true);
    await processPayment(
      activeCourse.title,
      activeCourse.price,
      (response) => {
        setPaying(false);
        alert(`Payment successful! You now have access to ${activeCourse.title} videos.`);
        if (onPurchaseSuccess) onPurchaseSuccess(activeCourse.title);
      },
      (error) => {
        setPaying(false);
        if (error.message !== "Payment cancelled by user") {
          alert(error.message);
        }
      }
    );
  };

  const handleWatchVideos = () => {
    navigate(`/watch/${encodeURIComponent(activeCourse.title)}`);
  };

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
              {activeCourse.price && !isPurchased && (
                <span className="modal-price-tag">  •  ₹{activeCourse.price.toLocaleString("en-IN")}</span>
              )}
            </p>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4>About this Course</h4>
            <p>{activeCourse.description}</p>
          </div>

          {isPurchased && activeCourse.videos && activeCourse.videos.length > 0 && (
            <div className="modal-video-preview">
              <h4>📹 Course Videos ({activeCourse.videos.length})</h4>
              <div className="video-preview-list">
                {activeCourse.videos.slice(0, 3).map((v, idx) => (
                  <div key={idx} className="video-preview-item">
                    <span className="video-preview-icon">▶️</span>
                    <span className="video-preview-title">{v.title}</span>
                    <span className="video-preview-duration">{v.duration}</span>
                  </div>
                ))}
                {activeCourse.videos.length > 3 && (
                  <div className="video-preview-more">
                    +{activeCourse.videos.length - 3} more videos
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress bar in Modal if Purchased */}
          {isPurchased && (
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
            {isPurchased ? (
              <p className="syllabus-instruction">
                Click checklist items to mark them as completed:
              </p>
            ) : (
              <p className="syllabus-instruction disabled">
                Purchase this course to unlock all content & track progress.
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
                    } ${!isPurchased ? "disabled" : ""}`}
                    onClick={() => isPurchased && toggleSyllabusItem(activeCourse.title, idx)}
                  >
                    {isPurchased ? (
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
                      <span className="syllabus-bullet-emoji">🔒</span>
                    )}
                    <span className="syllabus-item-text">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="modal-actions">
          {isPurchased ? (
            <>
              <button className="enroll-btn watch-btn" onClick={handleWatchVideos}>
                📺 Watch Course Videos
              </button>
              {isEnrolled && (
                <button
                  className="enroll-btn leave-btn"
                  onClick={() => {
                    toggleEnroll(activeCourse.title);
                    setActiveCourse(null);
                  }}
                >
                  Leave Course (Reset Progress)
                </button>
              )}
            </>
          ) : activeCourse.price ? (
            <div className="buy-only-section">
              <div className="buy-highlight-box">
                <div className="buy-price-display">
                  <span className="buy-label">Course Price</span>
                  <span className="buy-price">₹{activeCourse.price.toLocaleString("en-IN")}</span>
                </div>
                <ul className="buy-perks">
                  <li>✅ Full lifetime access</li>
                  <li>✅ HD video lectures</li>
                  <li>✅ Certificate of completion</li>
                  <li>✅ Progress tracking</li>
                </ul>
              </div>
              <button
                className="enroll-btn buy-btn buy-main-btn"
                onClick={handleBuyNow}
                disabled={paying}
              >
                {paying ? "⏳ Processing..." : `💳 Buy Now — ₹${activeCourse.price.toLocaleString("en-IN")}`}
              </button>
              <p className="buy-secure-note">🔒 Secure payment via Razorpay · UPI · Cards · NetBanking</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CourseModal;
