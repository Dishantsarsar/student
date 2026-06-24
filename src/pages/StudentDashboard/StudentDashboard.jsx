import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";

const pdfMaterials = {
  "Web Development": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Data Science": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Machine Learning": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Deep Learning": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Cyber Security": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Cloud Computing": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Mobile App Development": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Database Management": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Networking": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Software Engineering": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Artificial Intelligence": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Blockchain Development": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "DevOps": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Python Programming": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "Java Development": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "C & C++ Programming": {
    notes: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    assignments: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reference: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
};

function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("enrolled_courses");
      if (stored) {
        setEnrolledCourses(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load enrolled courses", e);
    }
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Access your course materials — PDF notes, assignments & references</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">📚</div>
          <h3>No Enrolled Courses</h3>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="browse-btn">Browse Courses</Link>
        </div>
      ) : (
        <div className="dashboard-courses">
          {enrolledCourses.map((title, idx) => {
            const materials = pdfMaterials[title];
            return (
              <div className="dashboard-card" key={idx}>
                <div className="d-card-header">
                  <h3>{title}</h3>
                  <span className="d-badge">Enrolled</span>
                </div>

                {materials ? (
                  <div className="pdf-list">
                    <a href={materials.notes} target="_blank" rel="noopener noreferrer" className="pdf-item">
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-label">Notes</span>
                      <span className="pdf-action">View PDF →</span>
                    </a>
                    <a href={materials.assignments} target="_blank" rel="noopener noreferrer" className="pdf-item">
                      <span className="pdf-icon">📝</span>
                      <span className="pdf-label">Assignments</span>
                      <span className="pdf-action">View PDF →</span>
                    </a>
                    <a href={materials.reference} target="_blank" rel="noopener noreferrer" className="pdf-item">
                      <span className="pdf-icon">📖</span>
                      <span className="pdf-label">Reference Book</span>
                      <span className="pdf-action">View PDF →</span>
                    </a>
                  </div>
                ) : (
                  <p className="no-materials">Materials coming soon.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
