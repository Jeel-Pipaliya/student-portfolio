import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { getTasks } from "../api";
import { Link } from "react-router-dom";

function Projects() {
  // Source selector: 'featured' vs 'backend' (Practical 6) vs 'github' (Practical 3)
  const [dataSource, setDataSource] = useState("featured");

  // GitHub state
  const [repos, setRepos] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState(null);

  // Backend Tasks state (Practical 6)
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState(null);

  // Common filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Fetch from our own Node+Express+MongoDB backend (Practical 6)
  const fetchBackendTasks = () => {
    setTaskLoading(true);
    setTaskError(null);

    getTasks()
      .then((data) => {
        if (data && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else if (Array.isArray(data)) {
          setTasks(data);
        } else {
          throw new Error("Unexpected response structure from backend API");
        }
      })
      .catch((err) => {
        setTaskError(
          err.message || "Failed to connect to Express/MongoDB backend at http://localhost:5000"
        );
      })
      .finally(() => {
        setTaskLoading(false);
      });
  };

  // Fetch GitHub repos (Practical 3)
  const fetchRepos = () => {
    setRepoLoading(true);
    setRepoError(null);

    fetch("https://api.github.com/users/Jeel-Pipaliya/repos?sort=updated")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API returned status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error("Unexpected response structure from GitHub");
        }
      })
      .catch((err) => {
        setRepoError(err.message || "Failed to fetch repositories from GitHub.");
      })
      .finally(() => {
        setRepoLoading(false);
      });
  };

  useEffect(() => {
    fetchBackendTasks();
    fetchRepos();
  }, []);

  // Filter backend tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedFilter === "All" || task.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter GitHub repos
  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLang =
      selectedFilter === "All" || repo.language === selectedFilter;
    return matchesSearch && matchesLang;
  });

  const featuredProjectsList = [
    {
      id: "creditwise",
      title: "CreditWise: Loan Approval Prediction System",
      category: "Machine Learning / Predictive Modeling",
      status: "Completed",
      description:
        "An end-to-end Machine Learning loan approval prediction system developed using Python, Pandas, and Scikit-learn to classify loan applications as approved or rejected based on financial and demographic features. Performed thorough Exploratory Data Analysis (EDA), missing value imputation, outlier handling, and feature engineering on attributes including applicant income, credit score, and debt-to-income (DTI) ratio to build a data-driven decision support system.",
      highlights: [
        "Classification model trained on demographic & financial credit factors",
        "Rigorous EDA, data cleaning, and outlier mitigation pipelines",
        "Feature engineering on Debt-to-Income (DTI) & Credit Score tiers",
        "High classification precision & recall for financial risk mitigation"
      ],
      techStack: ["Python", "Pandas", "NumPy", "Scikit-learn", "EDA", "Feature Engineering", "Classification"],
      repoUrl: "https://github.com/Jeel-Pipaliya/CreditWise-Loan-Approval-Prediction-System"
    },
    {
      id: "smartcart",
      title: "SmartCart: Customer Segmentation System",
      category: "Unsupervised Machine Learning",
      status: "Work in Progress",
      description:
        "An unsupervised Machine Learning clustering system engineered using Python, Pandas, and Scikit-learn to segment retail customers based on purchasing behaviour, shopping recency, transaction frequency, and basket size. Applied EDA, RFM analysis, normalization, and K-Means clustering algorithms to uncover actionable customer cohorts for personalized marketing campaigns and churn reduction.",
      highlights: [
        "Unsupervised K-Means clustering for granular customer cohort discovery",
        "RFM (Recency, Frequency, Monetary) feature extraction from sales logs",
        "Data normalization & elbow method optimization for optimal cluster k",
        "Actionable business intelligence for personalized marketing strategies"
      ],
      techStack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Clustering", "K-Means", "RFM Analysis"],
      repoUrl: "https://github.com/Jeel-Pipaliya/SmartCart-Customer-Segmentation-System-"
    },
    {
      id: "portfolio-fullstack",
      title: "Full-Stack Student Engineering Portfolio & Task Management Engine",
      category: "Full-Stack System Architecture & AI",
      status: "Active Deployment",
      description:
        "Production-grade distributed student portfolio and milestone engine built with React 19, Node/Express 5, MongoDB / Mongoose, JWT authentication, and Docker Compose orchestration. Integrates native EventEmitter for asynchronous background processing, node-cache in-memory acceleration, and OpenAI GPT-4o-mini API proxy with graceful degradation and rate-limiting.",
      highlights: [
        "React 19 single-page application with lazy route splitting & smooth Suspense",
        "Express 5 REST API with Level 3 HATEOAS self-describing hypermedia controls",
        "Secure server-side OpenAI API key encapsulation & resilient fallback mode",
        "Docker Compose 3-tier container orchestration (Nginx, Express, MongoDB)"
      ],
      techStack: ["React 19", "Node.js", "Express 5", "MongoDB", "Docker Compose", "OpenAI API", "CI/CD"],
      repoUrl: "https://github.com/Jeel-Pipaliya/student-portfolio"
    }
  ];

  const filteredFeatured = featuredProjectsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedFilter === "All" || p.category.includes(selectedFilter) || p.techStack.includes(selectedFilter);
    return matchesSearch && matchesCat;
  });

  const backendCategories = ["All", ...new Set(tasks.map((t) => t.category).filter(Boolean))];
  const githubLanguages = ["All", ...new Set(repos.map((r) => r.language).filter(Boolean))];

  return (
    <div className="projects-page-container">
      {/* Header Banner */}
      <section className="page-header-block">
        <span className="section-eyebrow">Portfolio Repository</span>
        <h1 className="page-main-title">Projects & Systems Showcase</h1>
        <p className="page-main-subtitle">
          Explore machine learning models from my resume alongside live repository telemetry from GitHub and Express/MongoDB backend milestones.
        </p>

        {/* Source Selector Tabs */}
        <div className="source-tabs-wrapper">
          <button
            className={`source-tab-btn ${dataSource === "featured" ? "active" : ""}`}
            onClick={() => {
              setDataSource("featured");
              setSelectedFilter("All");
              setSearchTerm("");
            }}
          >
            <span className="tab-icon">⭐</span>
            <span>Featured ML Projects ({featuredProjectsList.length})</span>
          </button>

          <button
            className={`source-tab-btn ${dataSource === "backend" ? "active" : ""}`}
            onClick={() => {
              setDataSource("backend");
              setSelectedFilter("All");
              setSearchTerm("");
            }}
          >
            <span className="tab-icon">⚙️</span>
            <span>Live Backend Tasks & Milestones ({tasks.length})</span>
          </button>

          <button
            className={`source-tab-btn ${dataSource === "github" ? "active" : ""}`}
            onClick={() => {
              setDataSource("github");
              setSelectedFilter("All");
              setSearchTerm("");
            }}
          >
            <span className="tab-icon">🐙</span>
            <span>Live GitHub Repositories ({repos.length})</span>
          </button>
        </div>
      </section>

      {/* Search and Filter Controls */}
      <div className="filter-controls-glass">
        <div className="search-input-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder={`Search ${
              dataSource === "featured"
                ? "machine learning projects..."
                : dataSource === "backend"
                ? "backend task milestones..."
                : "GitHub public repositories..."
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        {/* Dynamic Category Pill Bar */}
        <div className="filter-pills-row">
          <span className="filter-label">Filter:</span>
          {(dataSource === "featured"
            ? ["All", "Machine Learning", "Clustering", "Python", "Full-Stack"]
            : dataSource === "backend"
            ? backendCategories
            : githubLanguages
          ).map((filterVal) => (
            <button
              key={filterVal}
              className={`filter-pill-btn ${selectedFilter === filterVal ? "active" : ""}`}
              onClick={() => setSelectedFilter(filterVal)}
            >
              {filterVal}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          SOURCE 1: Featured ML Projects (From Resume)
          ===================================================================== */}
      {dataSource === "featured" && (
        <div className="featured-showcase-grid">
          {filteredFeatured.map((proj) => (
            <article key={proj.id} className="glass-card project-spotlight-card">
              <div className="spotlight-card-top">
                <div className="spotlight-category-chip">{proj.category}</div>
                <span className={`spotlight-status-tag status-${proj.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {proj.status}
                </span>
              </div>

              <h2 className="spotlight-title">{proj.title}</h2>
              <p className="spotlight-description">{proj.description}</p>

              <div className="spotlight-highlights-box">
                <h4 className="highlights-title">Key Architectural Highlights:</h4>
                <ul className="highlights-list">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="spotlight-tags-wrap">
                {proj.techStack.map((tech, i) => (
                  <span key={i} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="spotlight-action-row">
                <a
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary spotlight-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                  <span>Explore Repository on GitHub</span>
                  <span className="arrow">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =====================================================================
          SOURCE 2: Backend Tasks & Milestones
          ===================================================================== */}
      {dataSource === "backend" && (
        <div className="backend-tasks-view">
          {taskLoading && (
            <div className="state-placeholder">
              <Spinner />
              <p>Connecting to Node/Express backend at http://localhost:5000...</p>
            </div>
          )}

          {taskError && (
            <div className="error-wrap">
              <ErrorMessage message={taskError} />
              <button onClick={fetchBackendTasks} className="btn btn-secondary retry-btn">
                Retry Connection
              </button>
            </div>
          )}

          {!taskLoading && !taskError && filteredTasks.length === 0 && (
            <div className="state-placeholder empty-box">
              <p>No backend milestones match your search filters.</p>
            </div>
          )}

          {!taskLoading && !taskError && filteredTasks.length > 0 && (
            <div className="task-milestones-grid">
              {filteredTasks.map((task) => (
                <div key={task._id || task.id} className="glass-card task-milestone-card">
                  <div className="task-card-meta">
                    <span className="task-cat-badge">{task.category || "General"}</span>
                    <span className={`task-priority-badge priority-${task.priority || "medium"}`}>
                      {task.priority || "medium"}
                    </span>
                    <span className={`task-completed-badge ${task.completed ? "is-done" : "is-pending"}`}>
                      {task.completed ? "✓ Done" : "⏳ Pending"}
                    </span>
                  </div>

                  <h3 className="task-card-title">{task.title}</h3>
                  <p className="task-card-desc">{task.description}</p>

                  <div className="task-card-footer">
                    <span className="task-date">
                      {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Active Milestone"}
                    </span>
                    <Link to="/tasks" className="task-manage-link">
                      Manage in Dev Roadmap →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SOURCE 3: Live GitHub Repositories
          ===================================================================== */}
      {dataSource === "github" && (
        <div className="github-repos-view">
          {repoLoading && (
            <div className="state-placeholder">
              <Spinner />
              <p>Fetching public repositories from GitHub API (Jeel-Pipaliya)...</p>
            </div>
          )}

          {repoError && (
            <div className="error-wrap">
              <ErrorMessage message={repoError} />
              <button onClick={fetchRepos} className="btn btn-secondary retry-btn">
                Retry GitHub API
              </button>
            </div>
          )}

          {!repoLoading && !repoError && filteredRepos.length === 0 && (
            <div className="state-placeholder empty-box">
              <p>No public GitHub repositories match your search filters.</p>
            </div>
          )}

          {!repoLoading && !repoError && filteredRepos.length > 0 && (
            <div className="github-repos-grid">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="glass-card github-repo-card">
                  <div className="repo-card-top">
                    <span className="repo-privacy-tag">
                      {repo.private ? "Private" : "Public Repository"}
                    </span>
                    {repo.language && (
                      <span className="repo-lang-tag">
                        <span className="lang-color-dot"></span>
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <h3 className="repo-title">
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </h3>

                  <p className="repo-desc">
                    {repo.description || "No public description provided on GitHub."}
                  </p>

                  <div className="repo-metrics-row">
                    <span className="repo-metric" title="GitHub Stars">
                      ⭐ {repo.stargazers_count}
                    </span>
                    <span className="repo-metric" title="Forks">
                      🍴 {repo.forks_count}
                    </span>
                    <span className="repo-metric repo-updated">
                      Updated: {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="repo-action-wrap">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline repo-visit-btn"
                    >
                      <span>Visit GitHub Repo</span>
                      <span className="arrow">↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Projects;