import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { getTasks } from "../api";
import { Link } from "react-router-dom";

function Projects() {
  // Source selector: 'backend' (Practical 6) vs 'github' (Practical 3)
  const [dataSource, setDataSource] = useState("backend");

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

  const categories = ["All", ...new Set(tasks.map((t) => t.category).filter(Boolean))];
  const languages = ["All", ...new Set(repos.map((r) => r.language).filter(Boolean))];

  return (
    <section className="page projects-page">
      <div className="projects-header">
        <div className="title-row">
          <h1>Projects & Engineering Roadmap</h1>
          <span className="live-badge">
            {dataSource === "backend" ? "● Connected to Node/MongoDB API" : "⚡ Live GitHub API"}
          </span>
        </div>
        <p className="subtitle">
          {dataSource === "backend"
            ? "Full-stack integration (Practical 6): Live task data served from Express.js and MongoDB database."
            : "Practical 3 showcase: Dynamic projects and repositories fetched from the GitHub REST API."}
        </p>

        {/* Source Switcher (Practical 6 Core Requirement) */}
        <div className="source-toggle-bar" style={{ display: "flex", gap: "10px", margin: "16px 0" }}>
          <button
            className={`btn ${dataSource === "backend" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setDataSource("backend");
              setSelectedFilter("All");
            }}
          >
            🗄️ Backend Tasks (MongoDB / Practical 6)
          </button>
          <button
            className={`btn ${dataSource === "github" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setDataSource("github");
              setSelectedFilter("All");
            }}
          >
            🐙 GitHub Repositories (Practical 3)
          </button>
        </div>

        {/* Stats Strip */}
        {dataSource === "backend" && !taskLoading && !taskError && (
          <div className="stats-strip">
            <div className="stat-pill">
              <strong>{tasks.length}</strong> MongoDB Documents
            </div>
            <div className="stat-pill">
              <strong>{tasks.filter((t) => t.completed).length}</strong> Completed Milestones
            </div>
            <div className="stat-pill">
              <strong>{tasks.filter((t) => !t.completed).length}</strong> In Progress
            </div>
            <Link to="/tasks" className="stat-pill" style={{ textDecoration: "none", color: "#3b82f6", fontWeight: "600" }}>
              ➔ Manage CRUD in Sprint Hub
            </Link>
          </div>
        )}

        {dataSource === "github" && !repoLoading && !repoError && (
          <div className="stats-strip">
            <div className="stat-pill">
              <strong>{repos.length}</strong> Repositories
            </div>
            <div className="stat-pill">
              <strong>{repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)}</strong> Stars
            </div>
            <div className="stat-pill">
              <strong>{languages.length - 1}</strong> Languages
            </div>
          </div>
        )}
      </div>

      {/* BACKEND TASKS VIEW (PRACTICAL 6) */}
      {dataSource === "backend" && (
        <>
          <div className="controls-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search MongoDB tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="filter-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${selectedFilter === cat ? "active" : ""}`}
                  onClick={() => setSelectedFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {taskLoading && <Spinner />}

          {taskError && !taskLoading && (
            <ErrorMessage
              message={taskError}
              onRetry={fetchBackendTasks}
            />
          )}

          {!taskLoading && !taskError && filteredTasks.length === 0 && (
            <div className="empty-state">
              <p>No backend tasks found.</p>
              <button className="btn btn-secondary" onClick={fetchBackendTasks}>
                Retry Sync
              </button>
            </div>
          )}

          {!taskLoading && !taskError && filteredTasks.length > 0 && (
            <div className="projects-grid">
              {filteredTasks.map((task) => (
                <div key={task._id || task.id} className="project-card">
                  <div className="card-top">
                    <span className="folder-icon">🗂️</span>
                    <span className={`priority-badge priority-${(task.priority || "medium").toLowerCase()}`}>
                      {task.priority || "medium"}
                    </span>
                  </div>
                  <h3 className="project-title">{task.title}</h3>
                  <p className="project-description">
                    {task.description || "No description provided."}
                  </p>
                  <div className="card-footer" style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="language-badge" style={{ fontSize: "12px", background: "#e2e8f0", padding: "4px 8px", borderRadius: "4px" }}>
                      {task.category || "General"}
                    </span>
                    <span style={{ fontSize: "12px", color: task.completed ? "#10b981" : "#f59e0b", fontWeight: "600" }}>
                      {task.completed ? "✓ Delivered" : "⚡ In Sprint"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* GITHUB REPOS VIEW (PRACTICAL 3) */}
      {dataSource === "github" && (
        <>
          <div className="controls-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search GitHub repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="filter-chips">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={`chip ${selectedFilter === lang ? "active" : ""}`}
                  onClick={() => setSelectedFilter(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {repoLoading && <Spinner />}

          {repoError && !repoLoading && (
            <ErrorMessage
              message={repoError}
              onRetry={fetchRepos}
            />
          )}

          {!repoLoading && !repoError && filteredRepos.length === 0 && (
            <div className="empty-state">
              <p>No repositories match your search or filter.</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {!repoLoading && !repoError && filteredRepos.length > 0 && (
            <div className="projects-grid">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="project-card">
                  <div className="card-top">
                    <span className="folder-icon">📂</span>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                      aria-label={`Open ${repo.name} on GitHub`}
                    >
                      ↗
                    </a>
                  </div>
                  <h3 className="project-title">{repo.name}</h3>
                  <p className="project-description">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="card-footer">
                    {repo.language && (
                      <span className="language-badge">
                        <span className="lang-dot"></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="stars-count">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Projects;