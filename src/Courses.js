import React, { useState, useEffect } from "react";
import "./Courses.css";

const coursesData = [
  {
    title: "Web Development",
    description: "Build beautiful responsive websites and dynamic web applications using modern web technologies.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    emoji: "💻",
    syllabus: [
      "HTML5, CSS3, Flexbox & Grid Layouts",
      "Modern JavaScript (ES6+ Features)",
      "React JS (Hooks, Context API, Router)",
      "Node.js & Express RESTful APIs",
      "MongoDB & Mongoose Databases",
      "Git, GitHub & Cloud Deployment",
    ],
  },
  {
    title: "Data Science",
    description: "Analyze, visualize, and extract valuable insights from complex data structures using python.",
    duration: "8 Months",
    level: "Intermediate",
    emoji: "📊",
    syllabus: [
      "Python programming fundamentals",
      "Data Manipulation with Pandas & NumPy",
      "Data Visualization with Matplotlib & Seaborn",
      "SQL databases and data warehousing",
      "Applied Statistics & Probability",
      "Intro to Machine Learning Models",
    ],
  },
  {
    title: "Machine Learning",
    description: "Master algorithms that learn from data and make predictions using industrial ML toolkits.",
    duration: "6 Months",
    level: "Advanced",
    emoji: "🤖",
    syllabus: [
      "Supervised vs Unsupervised Learning",
      "Regression, Decision Trees & Random Forests",
      "Feature Engineering & Dimensionality Reduction",
      "TensorFlow and PyTorch basics",
      "Model Evaluation & Hyperparameter Tuning",
      "Deploying ML Models as Web APIs",
    ],
  },
  {
    title: "Deep Learning",
    description: "Dive deep into artificial neural networks, computer vision, and speech processing technologies.",
    duration: "5 Months",
    level: "Advanced",
    emoji: "🧠",
    syllabus: [
      "Multi-Layer Perceptrons & Backpropagation",
      "Convolutional Neural Networks (CNNs) for Images",
      "Recurrent Neural Networks (RNNs) & LSTMs",
      "Generative Adversarial Networks (GANs)",
      "PyTorch framework development",
      "Transfer Learning & Model Fine-tuning",
    ],
  },
  {
    title: "Cyber Security",
    description: "Secure digital assets, perform ethical hacking, and protect networks from cyber threats.",
    duration: "6 Months",
    level: "Intermediate",
    emoji: "🔒",
    syllabus: [
      "Networking Protocols & Cyber Security Foundations",
      "Ethical Hacking & Penetration Testing",
      "Cryptography, SSL/TLS, and PKI",
      "Linux Administration & Bash Scripting",
      "Web Application Hacking Techniques",
      "Incident Response & Vulnerability Assessment",
    ],
  },
  {
    title: "Cloud Computing",
    description: "Deploy, manage, and scale server infrastructure on AWS, Azure, and Google Cloud Platform.",
    duration: "4 Months",
    level: "Intermediate",
    emoji: "☁️",
    syllabus: [
      "Cloud Infrastructure Basics & Models",
      "AWS Core Services (EC2, S3, RDS, IAM)",
      "Containerization using Docker",
      "Container Orchestration with Kubernetes",
      "Serverless computing & Microservices",
      "Cloud Security & Compliance best practices",
    ],
  },
  {
    title: "Mobile App Development",
    description: "Build high-performance, cross-platform Android and iOS applications with single codebase.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    emoji: "📱",
    syllabus: [
      "JavaScript/Dart Fundamentals",
      "React Native or Flutter Frameworks",
      "Mobile UI Design & Gesture Handlers",
      "State Management (Redux/Provider)",
      "Integrating APIs & Native Device Features",
      "App Store & Google Play Publishing",
    ],
  },
  {
    title: "Database Management",
    description: "Design and implement relational and non-relational database storage systems for high throughput.",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    emoji: "🗄️",
    syllabus: [
      "Relational Database Design & Schema Creation",
      "Structured Query Language (SQL) Advanced Queries",
      "NoSQL Databases (MongoDB, Cassandra)",
      "Database Indexing & Performance Tuning",
      "Transactions, ACID Properties, and Concurrency",
      "Backup, Recovery, and Replication Strategies",
    ],
  },
  {
    title: "Networking",
    description: "Configure switches, routers, and secure networks for large enterprises and setups.",
    duration: "4 Months",
    level: "Beginner to Intermediate",
    emoji: "🌐",
    syllabus: [
      "TCP/IP and OSI Networking Reference Models",
      "IP Addressing, Subnetting, and Routing Concepts",
      "Switching Basics, VLANs, and Spanning Tree Protocol",
      "Routing Protocols (OSPF, BGP, RIP)",
      "Network Address Translation (NAT) & Firewalls",
      "Introduction to CCNA standards & certification",
    ],
  },
  {
    title: "Software Engineering",
    description: "Learn methodologies, architecture design patterns, and engineering practices used in tech industries.",
    duration: "5 Months",
    level: "Intermediate",
    emoji: "⚙️",
    syllabus: [
      "Software Development Lifecycle (SDLC) & Agile",
      "System Architecture & Object-Oriented Design",
      "Design Patterns (Singleton, Factory, MVC)",
      "Unit Testing, Integration Testing, and TDD",
      "CI/CD Pipelines & Version Control (Git)",
      "Code Refactoring & Technical Debt Management",
    ],
  },
  {
    title: "Artificial Intelligence",
    description: "Understand Natural Language Processing, computer vision, and build Large Language Model applications.",
    duration: "8 Months",
    level: "Advanced",
    emoji: "🔮",
    syllabus: [
      "Introduction to AI & Search Algorithms",
      "Natural Language Processing (NLP) foundations",
      "Computer Vision & Object Detection",
      "Large Language Models (LLMs) & Prompts",
      "LangChain & Vector Databases (Pinecone, Chroma)",
      "AI Ethics, Bias, and Future Technologies",
    ],
  },
  {
    title: "Blockchain Development",
    description: "Code smart contracts, develop decentralized applications (DApps), and understand cryptography.",
    duration: "5 Months",
    level: "Advanced",
    emoji: "⛓️",
    syllabus: [
      "Blockchain Cryptography & Distributed Ledgers",
      "Ethereum, Solidity Smart Contract Syntax",
      "Web3.js & Ethers.js frontend integration",
      "Decentralized Application (DApp) development",
      "Tokens (ERC-20, ERC-721 NFTs) & DeFi Basics",
      "Smart Contract Auditing & Security Vulnerabilities",
    ],
  },
  {
    title: "DevOps",
    description: "Automate build deployments, manage server configurations, and setup monitoring systems.",
    duration: "4 Months",
    level: "Intermediate",
    emoji: "🚀",
    syllabus: [
      "DevOps Culture & Agile Operations",
      "Continuous Integration & Deployment (Jenkins, Actions)",
      "Infrastructure as Code (IaC) with Terraform",
      "Configuration Management using Ansible",
      "Server Monitoring (Prometheus, Grafana)",
      "Log aggregation and analytics (ELK Stack)",
    ],
  },
  {
    title: "Python Programming",
    description: "Learn the most popular language for scripting, automation, web applications, and analytics.",
    duration: "3 Months",
    level: "Beginner to Advanced",
    emoji: "🐍",
    syllabus: [
      "Python Basics: Variables, Loops, and Functions",
      "Object-Oriented Programming (OOP) in Python",
      "File I/O, Error Handling, and Libraries",
      "Interacting with Web APIs and JSON",
      "Automation scripts & web scraping with BeautifulSoup",
      "Writing Clean Code (PEP 8 Standards)",
    ],
  },
  {
    title: "Java Development",
    description: "Develop enterprise-scale backend web services using Java and Spring Boot framework.",
    duration: "6 Months",
    level: "Intermediate",
    emoji: "☕",
    syllabus: [
      "Java Language syntax, OOP, and Collections",
      "Multi-threading & Exception Handling",
      "Spring Boot Framework & Spring MVC",
      "Spring Data JPA & Hibernate ORM mapping",
      "Microservices Architecture & REST API Security",
      "Testing with JUnit and Mockito",
    ],
  },
  {
    title: "C & C++ Programming",
    description: "Understand low-level memory layout, pointers, and high-performance programming techniques.",
    duration: "4 Months",
    level: "Beginner to Advanced",
    emoji: "👾",
    syllabus: [
      "Basic syntax, Control structures & Functions",
      "Pointers, References, and Memory Management",
      "Object-Oriented Programming in C++",
      "Standard Template Library (STL) Containers",
      "Basic Data Structures (Stacks, Queues, Trees)",
      "Algorithms (Sorting, Binary Search, Big-O)",
    ],
  },
];

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Load favorites from localstorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("fav_courses");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  // Sync favorites to localstorage
  const toggleFavorite = (courseTitle, e) => {
    e.stopPropagation(); // Avoid opening the details modal
    let updatedFavorites;
    if (favorites.includes(courseTitle)) {
      updatedFavorites = favorites.filter((title) => title !== courseTitle);
    } else {
      updatedFavorites = [...favorites, courseTitle];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("fav_courses", JSON.stringify(updatedFavorites));
  };

  // Filter courses based on Search, Selected Level, and Favorites checkbox
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === "All" ||
      course.level.toLowerCase().includes(selectedLevel.toLowerCase());

    const matchesFavorite = !showOnlyFavorites || favorites.includes(course.title);

    return matchesSearch && matchesLevel && matchesFavorite;
  });

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>IT Courses</h1>
        <p>Comprehensive, state-of-the-art training programs to accelerate your tech career</p>
      </div>

      {/* Search and Filters Section */}
      <div className="search-filter-container">
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

          {/* Show Favorites Toggle */}
          <div
            className="favorites-toggle-wrapper"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            <input
              type="checkbox"
              className="favorites-checkbox"
              checked={showOnlyFavorites}
              onChange={() => {}} // Controlled by click on parent div
            />
            <span className="favorites-label">
              Show Favorites ({favorites.length})
            </span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => {
            const isFav = favorites.includes(course.title);
            return (
              <div
                className="course-card"
                key={index}
                onClick={() => setActiveCourse(course)}
              >
                <div className="card-top">
                  <div className="course-icon">{course.emoji}</div>
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
      {activeCourse && (
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

              <div className="modal-section">
                <h4>Syllabus Details</h4>
                <ul className="syllabus-list">
                  {activeCourse.syllabus.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              className="enroll-btn"
              onClick={() => {
                alert(`Successfully Enrolled in ${activeCourse.title}!`);
                setActiveCourse(null);
              }}
            >
              Enroll in Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
