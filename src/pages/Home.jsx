import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

function Home() {
  const certifications = [
    {
      title: "Algorithm Design & Analysis",
      issuer: "Coursera",
      grade: "95% Score",
      link: "https://www.coursera.org/account/accomplishments/verify/WFQBL4KD5ZNH?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
      badge: "Verified Credential",
      icon: "⚡",
      color: "indigo"
    },
    {
      title: "Mathematics for Machine Learning",
      issuer: "Coursera",
      grade: "94% Score",
      link: "https://coursera.org/share/e388cfb5e280200d80376e37abac6f4f",
      badge: "Verified Credential",
      icon: "📐",
      color: "violet"
    },
    {
      title: "C++ Programming Certification",
      issuer: "NPTEL / IIT",
      grade: "Elite Certification",
      link: "https://drive.google.com/file/d/1HUGXmsQvAM804lVFhapvzaukLxNOuC7V/view?usp=sharing",
      badge: "Elite National Credential",
      icon: "💻",
      color: "cyan"
    },
    {
      title: "All India University Handball Athlete",
      issuer: "AIU National Games",
      grade: "Handball Goal Keeper",
      link: "https://drive.google.com/file/d/19oKz4AgkMLeJMn-OlUV_tGhnrSWcK_NL/view?usp=drive_link",
      badge: "National Sports Credential",
      icon: "🤾‍♂️",
      color: "amber"
    }
  ];

  const skillCategories = [
    {
      title: "Machine Learning & Data Science",
      icon: "🧠",
      skills: [
        "Python",
        "Scikit-learn",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Exploratory Data Analysis (EDA)",
        "Feature Engineering",
        "Classification Models",
        "K-Means Clustering",
        "Predictive Modeling",
        "Model Evaluation"
      ]
    },
    {
      title: "Core Programming & Foundations",
      icon: "⌨️",
      skills: [
        "Python 3",
        "SQL (PostgreSQL/MySQL)",
        "C / C++ (NPTEL Certified)",
        "Data Structures & Algorithms",
        "Object-Oriented Programming (OOP)",
        "Database Design",
        "Mathematical Modeling"
      ]
    },
    {
      title: "Full-Stack Web Development",
      icon: "🌐",
      skills: [
        "React 19 & React Router",
        "Node.js & Express 5",
        "MongoDB & Mongoose ODM",
        "RESTful API & HATEOAS",
        "JWT Authentication & bcrypt",
        "Node-Cache In-Memory Engine",
        "EventEmitter Asynchronous Bus"
      ]
    },
    {
      title: "Cloud, DevOps & Tooling",
      icon: "🛠️",
      skills: [
        "Git & GitHub Workflows",
        "GitHub Actions CI/CD Pipelines",
        "Docker & Multi-Stage Builds",
        "Docker Compose Orchestration",
        "OpenAI GPT-4o-mini API",
        "Postman API Testing",
        "Vite & Modern Tooling",
        "ESLint & Node Test Runner"
      ]
    }
  ];

  const featuredProjects = [
    {
      title: "CreditWise Loan Approval Prediction System",
      status: "Completed",
      type: "Machine Learning / Predictive Modeling",
      description:
        "Engineered an end-to-end ML loan eligibility scoring pipeline using Python, Pandas, and Scikit-learn. Performed deep exploratory data analysis, outlier remediation, and feature engineering across income, credit score, and debt-to-income (DTI) metrics to classify applications as approved or rejected with high recall.",
      tags: ["Python", "Scikit-learn", "Pandas", "NumPy", "EDA", "Feature Engineering", "Classification"],
      repoUrl: "https://github.com/Jeel-Pipaliya/CreditWise-Loan-Approval-Prediction-System",
      metrics: "Decision Support System with Financial Risk Modeling"
    },
    {
      title: "SmartCart Customer Segmentation System",
      status: "In Progress",
      type: "Unsupervised Machine Learning",
      description:
        "Constructed an unsupervised customer behavioral clustering system using Python, Scikit-learn, and Pandas. Implemented RFM (Recency, Frequency, Monetary) analytics, data standardization, and K-Means clustering to discover distinct consumer cohorts for personalized marketing automation.",
      tags: ["Python", "Pandas", "Scikit-learn", "Clustering", "K-Means", "RFM Analysis", "Customer Profiling"],
      repoUrl: "https://github.com/Jeel-Pipaliya/SmartCart-Customer-Segmentation-System-",
      metrics: "Unsupervised Cohort Discovery & Behavioral Insights"
    },
    {
      title: "Full-Stack Student Engineering Portfolio & Task API",
      status: "Active Deployment",
      type: "Full-Stack System & AI Integration",
      description:
        "Engineered an enterprise-grade full-stack portfolio and milestone management system. Features React 19 SPA, Express 5 REST engine with JWT auth, Node native EventEmitter asynchronous bus, node-cache telemetry, Docker Compose orchestration, and OpenAI GPT-4o-mini integration with graceful degradation.",
      tags: ["React 19", "Express 5", "MongoDB", "Docker Compose", "OpenAI API", "CI/CD", "JWT"],
      repoUrl: "https://github.com/Jeel-Pipaliya/student-portfolio",
      metrics: "Production Multi-Service Containerized Architecture"
    }
  ];

  return (
    <div className="home-container">
      {/* =====================================================================
          1. Hero Section with Glow, Gradient Branding & Key Metrics
          ===================================================================== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span>Open to Machine Learning & Data Science Internships</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">Jeel Pipaliya</span>
          </h1>

          <p className="hero-role">
            AI-ML Undergraduate <span className="role-divider">•</span> Academic Rank Holder{" "}
            <span className="role-divider">•</span> Predictive Modeling Enthusiast
          </p>

          <p className="hero-bio">
            Undergraduate in Artificial Intelligence & Machine Learning at{" "}
            <strong>CSPIT - CHARUSAT University</strong> (CGPA: <strong>8.18</strong>).
            Specialized in data preprocessing, exploratory data analysis (EDA), feature
            engineering, and predictive machine learning models using Python and Scikit-learn,
            paired with robust full-stack web engineering.
          </p>

          <div className="hero-cta-group">
            <Link to="/projects" className="btn btn-primary">
              <span>Explore Projects</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link to="/tasks" className="btn btn-secondary">
              <span>Dev Roadmap</span>
            </Link>

            <Link to="/contact" className="btn btn-outline">
              <span>Get in Touch</span>
            </Link>

            <a
              href="https://github.com/Jeel-Pipaliya"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              title="GitHub Profile"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-box">
              <span className="metric-value">8.18</span>
              <span className="metric-label">CGPA (Rank Holder)</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-value">95%</span>
              <span className="metric-label">Coursera Algorithm Design</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-value">94%</span>
              <span className="metric-label">Maths for Machine Learning</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-value">National</span>
              <span className="metric-label">Handball Goal Keeper</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-visual">
          <div className="profile-card-glass">
            <div className="card-avatar-wrapper">
              <img
                src={heroImg}
                alt="Jeel Pipaliya Avatar"
                className="card-avatar-img"
              />
              <div className="avatar-online-badge" title="Actively Coding"></div>
            </div>

            <div className="card-details">
              <h3 className="card-name">Jeel Pipaliya</h3>
              <p className="card-role">B.Tech AI-ML | CSPIT-CHARUSAT</p>
              <p className="card-id">Student ID: <strong>24AIML051</strong></p>

              <div className="card-tags">
                <span className="tag-chip">Machine Learning</span>
                <span className="tag-chip">Scikit-learn</span>
                <span className="tag-chip">Full-Stack Dev</span>
              </div>

              <div className="card-links-row">
                <a
                  href="https://www.linkedin.com/in/jeelpipaliya/"
                  target="_blank"
                  rel="noreferrer"
                  className="card-social-btn"
                  title="LinkedIn Profile"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="mailto:24aiml051@charusat.edu.in"
                  className="card-social-btn"
                  title="Direct Email"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. Profile Summary & Education Highlights
          ===================================================================== */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-eyebrow">Academic Background</span>
          <h2 className="section-title">Profile Summary & Education</h2>
          <p className="section-subtitle">
            Solid foundations in mathematical algorithms, machine learning pipelines, and academic excellence.
          </p>
        </div>

        <div className="profile-summary-grid">
          <div className="glass-card summary-card">
            <div className="card-icon-title">
              <span className="card-symbol">🎯</span>
              <h3>Executive Profile</h3>
            </div>
            <p className="summary-text">
              AI-ML undergraduate skilled in Machine Learning, Data Analysis, and Predictive Modeling using
              Python, Pandas, NumPy, and Scikit-learn. Experienced in Exploratory Data Analysis (EDA), feature
              engineering, and ML model development through rigorous academic and applied projects. Seeking a
              <strong> Machine Learning / Data Science Internship</strong> to apply analytical rigor to real-world
              datasets and scalable software products.
            </p>
            <div className="summary-highlights">
              <div className="highlight-pill">
                <strong>Current Focus:</strong> Supervised Learning & Unsupervised Customer Clustering
              </div>
              <div className="highlight-pill">
                <strong>Affiliation:</strong> CSPIT - CHARUSAT University (Sem 5, ITUE301)
              </div>
            </div>
          </div>

          <div className="glass-card education-card">
            <div className="card-icon-title">
              <span className="card-symbol">🎓</span>
              <h3>Formal Education</h3>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>B.Tech in Artificial Intelligence & Machine Learning</h4>
                  <span className="timeline-badge rank-badge">CGPA: 8.18 (Rank Holder)</span>
                </div>
                <p className="institution-name">
                  CSPIT - Charotar University of Science and Technology (CHARUSAT), Gujarat
                </p>
                <p className="timeline-date">April 2024 – 2026 (Ongoing)</p>
                <p className="timeline-desc">
                  Ranked among top-tier academic performers in the AI-ML cohort. Coursework highlights:
                  Machine Learning, Mathematics for ML, Data Structures & Algorithms, Advanced Web Development
                  Frameworks, and Cloud Containerization.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>Senior Secondary Certificate Examination (Class XII - CBSE)</h4>
                  <span className="timeline-badge">83.5% Score</span>
                </div>
                <p className="institution-name">Jawahar Navodaya Vidyalaya (JNV), Tapi, Gujarat</p>
                <p className="timeline-date">Graduated: 2024</p>
                <p className="timeline-desc">
                  Specialized in Science stream with deep foundations in Mathematics, Physics, and Computer Science.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. Technical Skills Matrix
          ===================================================================== */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-eyebrow">Technical Capabilities</span>
          <h2 className="section-title">Comprehensive Skills Matrix</h2>
          <p className="section-subtitle">
            Curated toolkit spanning predictive machine learning, algorithmic design, and full-stack architecture.
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="glass-card skill-group-card">
              <div className="skill-group-header">
                <span className="skill-cat-icon">{cat.icon}</span>
                <h3 className="skill-group-title">{cat.title}</h3>
              </div>
              <div className="skill-chips-wrap">
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. Featured Projects Showcase
          ===================================================================== */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-eyebrow">Applied Work</span>
          <h2 className="section-title">Featured Academic & Machine Learning Projects</h2>
          <p className="section-subtitle">
            Directly from portfolio repository: data-driven decision engines and production web architectures.
          </p>
        </div>

        <div className="projects-grid">
          {featuredProjects.map((project, idx) => (
            <div key={idx} className="glass-card project-card-elevated">
              <div className="project-card-header">
                <span className="project-type-tag">{project.type}</span>
                <span className={`project-status-badge ${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {project.status}
                </span>
              </div>

              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-desc">{project.description}</p>

              <div className="project-metrics-callout">
                <span className="callout-icon">📊</span>
                <span className="callout-text">{project.metrics}</span>
              </div>

              <div className="project-tech-tags">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="tech-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="project-card-footer">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                  <span>View Repository</span>
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="view-more-center">
          <Link to="/projects" className="btn btn-secondary">
            <span>Browse Full Projects Directory & GitHub Repositories</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================================
          5. Certifications, Honors & Extracurriculars
          ===================================================================== */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-eyebrow">Verified Credentials</span>
          <h2 className="section-title">Certifications & Notable Achievements</h2>
          <p className="section-subtitle">
            Demonstrated mastery in algorithm design, mathematics for machine learning, and national athletics.
          </p>
        </div>

        <div className="certifications-grid">
          {certifications.map((cert, idx) => (
            <div key={idx} className={`glass-card cert-card border-glow-${cert.color}`}>
              <div className="cert-top-row">
                <span className="cert-icon">{cert.icon}</span>
                <span className="cert-badge">{cert.badge}</span>
              </div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-issuer">Issued by <strong>{cert.issuer}</strong></p>
              <div className="cert-grade-tag">
                <span>Result:</span> <strong>{cert.grade}</strong>
              </div>
              <a
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                className="cert-verify-link"
              >
                <span>Verify Credential Certificate</span>
                <span className="link-arrow">↗</span>
              </a>
            </div>
          ))}
        </div>

        <div className="extra-activities-card glass-card">
          <div className="extra-activities-header">
            <span className="extra-icon">🌟</span>
            <div>
              <h3>Leadership & Extracurricular Activities</h3>
              <p>Active involvement in university sports representation and community development</p>
            </div>
          </div>
          <div className="activities-list">
            <div className="activity-item">
              <span className="activity-bullet">🤾‍♂️</span>
              <div>
                <strong>All India University (AIU) Handball Goal Keeper:</strong> Represented CSPIT - CHARUSAT
                at the national inter-university championship level, fostering team coordination and resilience under pressure.
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-bullet">🤝</span>
              <div>
                <strong>Rotaract Active Member:</strong> Contributing to community outreach, digital literacy
                drives, and student leadership programs at CHARUSAT.
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-bullet">🏆</span>
              <div>
                <strong>Academic Rank Holder:</strong> Ranked among top-tier students in the B.Tech AI-ML program with an outstanding 8.18 CGPA.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. Interactive Quick Connect Banner
          ===================================================================== */}
      <section className="section-block cta-banner-section">
        <div className="cta-banner-glass">
          <div className="cta-text-content">
            <h2 className="cta-heading">Interested in collaborating or hiring?</h2>
            <p className="cta-sub">
              I am actively seeking <strong>Machine Learning / Data Science Internships</strong> and innovative
              full-stack development opportunities. Let's build something exceptional together!
            </p>
          </div>

          <div className="cta-action-buttons">
            <Link to="/contact" className="btn btn-primary cta-btn">
              <span>Send a Message</span>
              <span>✉️</span>
            </Link>
            <a
              href="mailto:24aiml051@charusat.edu.in"
              className="btn btn-secondary cta-btn"
            >
              <span>Direct Email</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;