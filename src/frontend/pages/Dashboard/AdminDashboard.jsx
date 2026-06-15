import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { coursesData } from "../../../backend/coursesData";

function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  // App States
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [globalEnrollments, setGlobalEnrollments] = useState({});
  const [activeTab, setActiveTab] = useState("courses"); // "courses" | "users" | "bot"
  
  // Bot Training State
  const [customKB, setCustomKB] = useState([]);
  const [botQuestion, setBotQuestion] = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [popularMarked, setPopularMarked] = useState([]);
  
  // Form State for Course CRUD
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLevel, setFormLevel] = useState("Beginner");
  const [formDuration, setFormDuration] = useState("");
  const [formEmoji, setFormEmoji] = useState("💻");
  const [syllabusItems, setSyllabusItems] = useState([""]);
  const [formAddedBy, setFormAddedBy] = useState("system");

  // Authentication check & sync
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/auth", { state: { isLogin: true } });
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      navigate(user.role === "teacher" ? "/teacher" : "/dashboard");
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

    // Sync users
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    // Sync enrollments
    const storedEnrollments = localStorage.getItem("global_enrollments");
    if (storedEnrollments) {
      setGlobalEnrollments(JSON.parse(storedEnrollments));
    }

    // Load Bot Training KB
    const storedKB = localStorage.getItem('chatbot_custom_kb');
    if (storedKB) setCustomKB(JSON.parse(storedKB));
    const storedPopular = localStorage.getItem('chatbot_popular_marked');
    if (storedPopular) setPopularMarked(JSON.parse(storedPopular));
  }, [navigate]);

  const refreshData = () => {
    const storedCourses = localStorage.getItem("all_courses");
    if (storedCourses) setCourses(JSON.parse(storedCourses));
    
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedEnrollments = localStorage.getItem("global_enrollments");
    if (storedEnrollments) setGlobalEnrollments(JSON.parse(storedEnrollments));
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormLevel("Beginner");
    setFormDuration("");
    setFormEmoji("💻");
    setSyllabusItems([""]);
    setFormAddedBy("system");
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
    setSyllabusItems(course.syllabus && course.syllabus.length > 0 ? [...course.syllabus] : [""]);
    setFormAddedBy(course.addedBy || "system");
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
    const courseTitle = courses[index].title;
    if (window.confirm(`Admin Action: Are you sure you want to delete the course "${courseTitle}"?`)) {
      const updatedCourses = courses.filter((_, idx) => idx !== index);
      setCourses(updatedCourses);
      localStorage.setItem("all_courses", JSON.stringify(updatedCourses));
      alert(`Successfully deleted ${courseTitle}!`);
      refreshData();
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
      syllabus: filteredSyllabus,
      addedBy: isEditMode ? formAddedBy : "system"
    };

    let updatedCourses = [...courses];
    if (isEditMode) {
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
    refreshData();
  };

  // Admin User CRUD Options
  const handleUserRoleChange = (email, newRole) => {
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // If we changed current user role, update session
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const updatedSelf = { ...currentUser, role: newRole };
      localStorage.setItem("user", JSON.stringify(updatedSelf));
      setCurrentUser(updatedSelf);
      if (newRole !== "admin") {
        navigate(newRole === "teacher" ? "/teacher" : "/dashboard");
      }
    }
    alert(`Successfully changed role to ${newRole}`);
  };

  const handleUserDelete = (email) => {
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      alert("You cannot delete your own admin account!");
      return;
    }
    if (window.confirm(`Are you sure you want to remove the user "${email}" from the system?`)) {
      const updatedUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert("User successfully deleted.");
    }
  };

  if (!currentUser) return null;

  const totalTeachers = users.filter(u => u.role === "teacher").length;
  const totalStudents = users.filter(u => u.role === "user").length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="orb orb-1" style={{ top: "-10%", right: "-10%" }}></div>
        <div className="orb orb-2" style={{ bottom: "-10%", left: "-10%" }}></div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar Profile Card */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">🛡️</div>
          <h3>{currentUser.name}</h3>
          <p className="profile-email">{currentUser.email}</p>
          <span className="profile-badge admin-badge" style={{ background: "linear-gradient(135deg, #ff0844, #ffb199)" }}>Admin Control</span>

          <div className="profile-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="stat-item">
              <span className="stat-val">{courses.length}</span>
              <span className="stat-lbl">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{totalTeachers}</span>
              <span className="stat-lbl">Teachers</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{totalStudents}</span>
              <span className="stat-lbl">Students</span>
            </div>
          </div>

          <div className="sidebar-menu" style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            <button 
              className={`tab-toggle-btn ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => setActiveTab("courses")}
              style={{
                width: "100%",
                padding: "12px 18px",
                background: activeTab === "courses" ? "rgba(0, 242, 254, 0.15)" : "transparent",
                border: "1px solid " + (activeTab === "courses" ? "rgba(0, 242, 254, 0.3)" : "rgba(255, 255, 255, 0.08)"),
                borderRadius: "10px",
                color: "#fff",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s"
              }}
            >
              📚 Course Registry
            </button>
            <button 
              className={`tab-toggle-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
              style={{
                width: "100%",
                padding: "12px 18px",
                background: activeTab === "users" ? "rgba(0, 242, 254, 0.15)" : "transparent",
                border: "1px solid " + (activeTab === "users" ? "rgba(0, 242, 254, 0.3)" : "rgba(255, 255, 255, 0.08)"),
                borderRadius: "10px",
                color: "#fff",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s"
              }}
            >
              👥 User Registry
            </button>
            <button 
              className={`tab-toggle-btn ${activeTab === "bot" ? "active" : ""}`}
              onClick={() => setActiveTab("bot")}
              style={{
                width: "100%",
                padding: "12px 18px",
                background: activeTab === "bot" ? "rgba(168, 85, 247, 0.15)" : "transparent",
                border: "1px solid " + (activeTab === "bot" ? "rgba(168, 85, 247, 0.4)" : "rgba(255, 255, 255, 0.08)"),
                borderRadius: "10px",
                color: "#fff",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s"
              }}
            >
              🤖 Bot Training
            </button>
          </div>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="dashboard-content">
          {activeTab === "bot" ? (
            <>
              <div className="dashboard-header-row">
                <h2>🤖 Bot Training Center</h2>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>{customKB.length} custom entries trained</span>
              </div>

              {/* Add Custom Q&A */}
              <section style={{ background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ color: "#c084fc", marginBottom: "16px", fontSize: "1rem" }}>➕ Add Custom Knowledge</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: "16px" }}>Train the chatbot with new Q&amp;A pairs — new courses, promotions, policies, or anything you want it to know.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>Question / Trigger phrase</label>
                    <input
                      value={botQuestion}
                      onChange={e => setBotQuestion(e.target.value)}
                      placeholder="e.g. Do you offer scholarships?"
                      style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "10px", color: "#fff", fontSize: "0.88rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>Answer</label>
                    <textarea
                      value={botAnswer}
                      onChange={e => setBotAnswer(e.target.value)}
                      placeholder="e.g. Yes! We offer merit-based scholarships. Contact admissions@solutionadda.com for details."
                      rows={4}
                      style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "10px", color: "#fff", fontSize: "0.88rem", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!botQuestion.trim() || !botAnswer.trim()) { alert("Please fill both question and answer."); return; }
                      const entry = { question: botQuestion.trim(), answer: botAnswer.trim(), createdAt: new Date().toLocaleDateString() };
                      const updated = [...customKB, entry];
                      setCustomKB(updated);
                      localStorage.setItem('chatbot_custom_kb', JSON.stringify(updated));
                      setBotQuestion(""); setBotAnswer("");
                      alert("✅ Bot trained successfully! The chatbot will now use this knowledge.");
                    }}
                    style={{ alignSelf: "flex-start", padding: "10px 24px", background: "linear-gradient(135deg, #a855f7, #7c3aed)", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    🧠 Train Bot
                  </button>
                </div>
              </section>

              {/* Mark Popular Courses */}
              <section style={{ background: "rgba(255, 165, 0, 0.05)", border: "1px solid rgba(255, 165, 0, 0.2)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ color: "#fbbf24", marginBottom: "12px", fontSize: "1rem" }}>🔥 Mark Popular Courses</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: "16px" }}>Star courses to manually feature them as "Popular" in the chatbot recommendations.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                  {courses.map(c => (
                    <button
                      key={c.title}
                      onClick={() => {
                        const updated = popularMarked.includes(c.title)
                          ? popularMarked.filter(t => t !== c.title)
                          : [...popularMarked, c.title];
                        setPopularMarked(updated);
                        localStorage.setItem('chatbot_popular_marked', JSON.stringify(updated));
                      }}
                      style={{
                        padding: "10px 14px",
                        background: popularMarked.includes(c.title) ? "rgba(251, 191, 36, 0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${popularMarked.includes(c.title) ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      {popularMarked.includes(c.title) ? "⭐" : "☆"} {c.emoji} {c.title}
                    </button>
                  ))}
                </div>
              </section>

              {/* Trained Entries List */}
              <section style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ color: "rgba(255,255,255,0.7)", marginBottom: "16px", fontSize: "1rem" }}>📋 Trained Knowledge ({customKB.length} entries)</h3>
                {customKB.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.88rem" }}>No custom entries yet. Add your first one above!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {customKB.map((entry, idx) => (
                      <div key={idx} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: "#c084fc", fontSize: "0.84rem", fontWeight: "600", marginBottom: "4px" }}>Q: {entry.question}</p>
                          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", lineHeight: 1.5 }}>A: {entry.answer}</p>
                          {entry.createdAt && <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", marginTop: "6px" }}>Added: {entry.createdAt}</p>}
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm("Remove this trained entry?")) {
                              const updated = customKB.filter((_, i) => i !== idx);
                              setCustomKB(updated);
                              localStorage.setItem('chatbot_custom_kb', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#f87171", padding: "6px 12px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit", flexShrink: 0 }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : activeTab === "courses" ? (
            <>
              <div className="dashboard-header-row">
                <h2>System Course Registry</h2>
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
                      <th>Added By</th>
                      <th>Enrolled Students</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, idx) => {
                      const enrollList = globalEnrollments[course.title] || [];
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
                                background: course.addedBy && course.addedBy !== "system" ? "rgba(0, 242, 254, 0.1)" : "rgba(255, 255, 255, 0.06)",
                                color: course.addedBy && course.addedBy !== "system" ? "#00f2fe" : "#b0b0b0"
                              }}
                            >
                              {course.addedBy || "system"}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: enrollList.length > 0 ? "#00f2fe" : "#fff" }}>
                              👥 {enrollList.length}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="table-btn edit" onClick={() => handleOpenEditForm(course, idx)}>
                                Edit
                              </button>
                              <button className="table-btn delete" onClick={() => handleDeleteCourse(idx)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </>
          ) : (
            <>
              <div className="dashboard-header-row">
                <h2>Registered Accounts</h2>
              </div>

              <section className="courses-list-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Teacher Verification Metrics</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <select 
                            value={user.role} 
                            onChange={(e) => handleUserRoleChange(user.email, e.target.value)}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              color: user.role === 'admin' ? '#ff0844' : user.role === 'teacher' ? '#00f2fe' : '#fff',
                              cursor: "pointer",
                              outline: "none"
                            }}
                          >
                            <option value="user" style={{ background: "#0a0a1a", color: "#fff" }}>Student</option>
                            <option value="teacher" style={{ background: "#0a0a1a", color: "#fff" }}>Teacher</option>
                            <option value="admin" style={{ background: "#0a0a1a", color: "#fff" }}>Admin</option>
                          </select>
                        </td>
                        <td>
                          {user.role === "teacher" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "0.82rem" }}>
                              <span style={{ color: "#00f2fe" }}>🛡️ Verified Instructor</span>
                              <span>📞 <b>Phone:</b> {user.phoneDialCode || ""} {user.phoneNumber || "N/A"}</span>
                              <span>💼 <b>Experience:</b> {user.experience ? `${user.experience} Years` : "N/A"}</span>
                              <span>🎓 <b>Degree:</b> {user.qualification || "N/A"}</span>
                              <span>🏫 <b>University:</b> {user.institution || "N/A"}</span>
                              {user.qualificationProof ? (
                                <a 
                                  href={user.qualificationProof} 
                                  download={user.qualificationProofName || "degree_proof"}
                                  style={{
                                    marginTop: "5px",
                                    color: "#00f2fe",
                                    textDecoration: "underline",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px"
                                  }}
                                >
                                  📄 View Proof ({user.qualificationProofName || "Attachment"})
                                </a>
                              ) : (
                                <span style={{ color: "rgba(255, 255, 255, 0.3)", fontStyle: "italic" }}>⚠️ No proof file uploaded</span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No verification required</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="table-btn delete" 
                            onClick={() => handleUserDelete(user.email)}
                            disabled={currentUser.email.toLowerCase() === user.email.toLowerCase()}
                            style={{ opacity: currentUser.email.toLowerCase() === user.email.toLowerCase() ? 0.3 : 1 }}
                          >
                            Delete User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Course Modal Form */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-content-card" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditMode ? "✏️ Edit Course (Admin)" : "➕ Add New Course (Admin)"}</h3>
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
                  <label>Syllabus Checkpoints *</label>
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

export default AdminDashboard;
