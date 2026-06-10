import "./Courses.css";

const courses = [
  {
    title: "Web Development",
    description: "HTML, CSS, JavaScript, React, Node.js, Express, MongoDB",
    duration: "6 Months",
    level: "Beginner to Advanced",
  },
  {
    title: "Data Science",
    description: "Python, Pandas, NumPy, Matplotlib, SQL, Statistics",
    duration: "8 Months",
    level: "Intermediate",
  },
  {
    title: "Machine Learning",
    description: "Supervised & Unsupervised Learning, TensorFlow, Scikit-learn",
    duration: "6 Months",
    level: "Advanced",
  },
  {
    title: "Deep Learning",
    description: "Neural Networks, CNN, RNN, GANs, PyTorch, Keras",
    duration: "5 Months",
    level: "Advanced",
  },
  {
    title: "Cyber Security",
    description: "Network Security, Ethical Hacking, Cryptography, Kali Linux",
    duration: "6 Months",
    level: "Intermediate",
  },
  {
    title: "Cloud Computing",
    description: "AWS, Azure, Google Cloud, Docker, Kubernetes",
    duration: "4 Months",
    level: "Intermediate",
  },
  {
    title: "Mobile App Development",
    description: "React Native, Flutter, Kotlin, Swift, Firebase",
    duration: "6 Months",
    level: "Beginner to Advanced",
  },
  {
    title: "Database Management",
    description: "MySQL, PostgreSQL, MongoDB, Redis, Database Design",
    duration: "4 Months",
    level: "Beginner to Intermediate",
  },
  {
    title: "Networking",
    description: "TCP/IP, OSI Model, Routing, Switching, CCNA Basics",
    duration: "4 Months",
    level: "Beginner to Intermediate",
  },
  {
    title: "Software Engineering",
    description: "SDLC, Agile, Git, DevOps, Testing, Design Patterns",
    duration: "5 Months",
    level: "Intermediate",
  },
  {
    title: "Artificial Intelligence",
    description: "NLP, Computer Vision, Reinforcement Learning, LLMs",
    duration: "8 Months",
    level: "Advanced",
  },
  {
    title: "Blockchain Development",
    description: "Solidity, Ethereum, Smart Contracts, Web3, DApps",
    duration: "5 Months",
    level: "Advanced",
  },
  {
    title: "DevOps",
    description: "CI/CD, Jenkins, Docker, Kubernetes, Ansible, Terraform",
    duration: "4 Months",
    level: "Intermediate",
  },
  {
    title: "Python Programming",
    description: "Python Basics, OOP, File Handling, APIs, Automation",
    duration: "3 Months",
    level: "Beginner to Advanced",
  },
  {
    title: "Java Development",
    description: "Core Java, Spring Boot, Hibernate, Microservices",
    duration: "6 Months",
    level: "Intermediate",
  },
  {
    title: "C & C++ Programming",
    description: "Pointers, Memory Management, STL, Data Structures",
    duration: "4 Months",
    level: "Beginner to Advanced",
  },
];

function Courses() {
  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>IT Courses</h1>
        <p>Comprehensive IT courses to boost your career</p>
      </div>
      <div className="courses-grid">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <div className="course-icon">
              {course.title.charAt(0)}
            </div>
            <h3>{course.title}</h3>
            <p className="course-desc">{course.description}</p>
            <div className="course-meta">
              <span className="meta-item">
                <strong>Duration:</strong> {course.duration}
              </span>
              <span className="meta-item">
                <strong>Level:</strong> {course.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
