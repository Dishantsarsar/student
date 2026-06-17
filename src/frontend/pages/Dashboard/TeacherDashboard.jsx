import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { coursesData } from "../../../backend/coursesData";

function TeacherDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLevel, setFormLevel] = useState("Beginner");
  const [formDuration, setFormDuration] = useState("");
  const [formEmoji, setFormEmoji] = useState("💻");
  const [formPrice, setFormPrice] = useState("");
  const [syllabusItems, setSyllabusItems] = useState([""]);

  // Authentication check & sync
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "teacher") {
      navigate("/dashboard");
      return;
    }
    setCurrentUser(user);

    // Sync courses
    const storedCourses = localStorage.getItem("all_courses");
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      localStorage.setItem("all_courses", JSON.stringify(coursesData));
      setCourses(coursesData);
    }
  }, [navigate]);

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormLevel("Beginner");
    setFormDuration("");
    setFormEmoji("💻");
    setFormPrice("");
    setSyllabusItems([""]);
    setIsEditMode(false);
    setEditIndex(-1);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEditForm = (course, index) => {
    setFormTitle(course.title);
    setFormDesc(course.description);
    setFormLevel(course.level);
    setFormDuration(course.duration);
    setFormEmoji(course.emoji || "💻");
    setFormPrice(course.price ? String(course.price) : "");
    setSyllabusItems(course.syllabus && course.syllabus.length > 0 ? [...course.syllabus] : [""]);
    setIsEditMode(true);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleSyllabusItemChange = (index, value) => {
    const updated = [...syllabusItems];
    updated[index] = value;
    setSyllabusItems(updated);
  };

  const handleAddSyllabusItem = () => {
    setSyllabusItems([...syllabusItems, ""]);
  };

  const handleRemoveSyllabusItem = (index) => {
    const updated = syllabusItems.filter((_, idx) => idx !== index);
    setSyllabusItems(updated.length > 0 ? updated : [""]);
  };

  const handleDeleteCourse = (index) => {
    const course = courses[index];
    if (course.addedBy !== currentUser.email) {
      alert("You are not authorized to delete this course.");
      return;
    }

    const enrollmentsStr = localStorage.getItem("global_enrollments");
    const globalEnrollments = enrollmentsStr ? JSON.parse(enrollmentsStr) : {};
    const enrollList = globalEnrollments[course.title] || [];
    if (enrollList.length > 0) {
      alert(`Cannot delete course: Students are actively enrolled in this course (${enrollList.length} enrolled).`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
      const updatedCourses = courses.filter((_, idx) => idx !== index);
      setCourses(updatedCourses);
      localStorage.setItem("all_courses", JSON.stringify(updatedCourses));
      alert(`Successfully deleted ${course.title}!`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim() || !formDuration.trim()) {
      alert("Please fill in all the required fields.");
      return;
    }

    const filteredSyllabus = syllabusItems.map(item => item.trim()).filter(item => item !== "");
    if (filteredSyllabus.length === 0) {
      alert("Please add at least one syllabus item.");
      return;
    }

    const courseObj = {
      title: formTitle,
      description: formDesc,
      level: formLevel,
      duration: formDuration,
      emoji: formEmoji,
      price: formPrice ? Number(formPrice) : undefined,
      syllabus: filteredSyllabus,
      addedBy: isEditMode ? (courses[editIndex].addedBy || "system") : currentUser.email,
      addedByName: isEditMode ? (courses[editIndex].addedByName || "System") : currentUser.name
    };

    let updatedCourses = [...courses];
    if (isEditMode) {
      if (courses[editIndex].addedBy !== currentUser.email) {
        alert("You are not authorized to edit this course.");
        return;
      }
      updatedCourses[editIndex] = courseObj;
      alert(`Successfully updated course "${formTitle}"!`);
    } else {
      const exists = courses.some(c => c.title.toLowerCase() === formTitle.toLowerCase());
      if (exists) {
        alert(`A course with the title "${formTitle}" already exists.`);
        return;
      }
      updatedCourses.push(courseObj);
      alert(`Successfully added new course "${formTitle}"!`);
    }

    setCourses(updatedCourses);
    localStorage.setItem("all_courses", JSON.stringify(updatedCourses));
    setShowForm(false);
    resetForm();
  };

  if (!currentUser) return null;

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
          <div className="profile-avatar">👨‍🏫</div>
          <h3>{currentUser.name}</h3>
          <p className="profile-email">{currentUser.email}</p>
          <span className="profile-badge admin-badge">Teacher</span>

          <div className="profile-stats">
            <div className="stat-item" style={{ gridColumn: "span 2" }}>
              <span className="stat-val">{courses.length}</span>
              <span className="stat-lbl">Total System Courses</span>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="dashboard-content">
          <div className="dashboard-header-row">
            <h2>Course Management (Teacher)</h2>
            <button className="admin-action-btn" onClick={handleOpenAddForm}>
              <span>➕</span> Add New Course
            </button>
          </div>

          <section className="courses-list-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course Info</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Creator</th>
                  <th>Syllabus Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => {
                  const isOwner = course.addedBy === currentUser.email;
                  return (
                    <tr key={idx}>
                      <td>
                        <div className="table-course-title">
                          <span className="table-emoji">{course.emoji || "💻"}</span>
                          <span>{course.title}</span>
                        </div>
                      </td>
                      <td>{course.level}</td>
                      <td>{course.duration}</td>
                      <td>
                        <span 
                          style={{ 
                            padding: "4px 8px", 
                            borderRadius: "6px", 
                            fontSize: "0.8rem", 
                            background: isOwner ? "rgba(0, 242, 254, 0.1)" : "rgba(255, 255, 255, 0.05)",
                            color: isOwner ? "#00f2fe" : "#a0a0a0"
                          }}
                        >
                          {isOwner ? "Me" : (course.addedBy || "system")}
                        </span>
                      </td>
                      <td>{course.syllabus ? course.syllabus.length : 0} items</td>
                      <td>
                        {isOwner ? (
                          <div className="table-actions">
                            <button className="table-btn edit" onClick={() => handleOpenEditForm(course, idx)}>
                              Edit
                            </button>
                            <button className="table-btn delete" onClick={() => handleDeleteCourse(idx)}>
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                            🔒 Read-Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      {/* Add / Edit Course Modal Form */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-content-card" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditMode ? "✏️ Edit Course" : "➕ Add New Course"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-row">
                <div className="form-field">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Artificial Intelligence"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Duration *</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 6 Months"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-field">
                  <label>Level *</label>
                  <select value={formLevel} onChange={(e) => setFormLevel(e.target.value)}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Beginner to Advanced">Beginner to Advanced</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Emoji Badge *</label>
                  <input
                    type="text"
                    value={formEmoji}
                    onChange={(e) => setFormEmoji(e.target.value)}
                    placeholder="e.g. 🧠"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-field">
                  <label>Price (₹) — Leave empty for free</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 1999"
                    min="0"
                  />
                </div>
                <div className="form-field">
                  <label>&nbsp;</label>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginTop: "8px" }}>
                    💡 Set a price for video access. Free courses show "Enroll" only.
                  </p>
                </div>
              </div>

              <div className="form-field">
                <label>Course Description *</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Provide a brief summary of the course target audience and outcomes."
                  rows="3"
                  required
                />
              </div>

              {/* Dynamic Syllabus Builder Section */}
              <div className="form-field">
                <div className="syllabus-builder-header">
                  <label>Syllabus Syllabus Checkpoints *</label>
                  <button type="button" className="btn-add-item" onClick={handleAddSyllabusItem}>
                    + Add Step
                  </button>
                </div>

                {syllabusItems.map((item, idx) => (
                  <div className="syllabus-input-row" key={idx}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleSyllabusItemChange(idx, e.target.value)}
                      placeholder={`Step ${idx + 1}`}
                      required
                    />
                    <button type="button" className="btn-remove-item" onClick={() => handleRemoveSyllabusItem(idx)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-action-btn">
                  {isEditMode ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
