import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortBy, setSortBy] = useState("updated");

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

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
        setError(err.message || "Failed to fetch repositories.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  // Extract unique languages for filter chips
  const languages = ["All", ...new Set(repos.map((r) => r.language).filter(Boolean))];

  // Filter and sort repositories
  const filteredRepos = repos
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description &&
          repo.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLang =
        selectedLanguage === "All" || repo.language === selectedLanguage;

      return matchesSearch && matchesLang;
    })
    .sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  return (
    <section className="page projects-page">
      <div className="projects-header">
        <div className="title-row">
          <h1>My Projects</h1>
          <span className="live-badge">⚡ Live GitHub API</span>
        </div>
        <p className="subtitle">
          Dynamic projects and repositories fetched in real-time from GitHub REST API
        </p>

        {!loading && !error && (
          <div className="stats-strip">
            <div className="stat-pill">
              <strong>{repos.length}</strong> Repositories
            </div>
            <div className="stat-pill">
              <strong>
                {repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)}
              </strong>{" "}
              Stars
            </div>
            <div className="stat-pill">
              <strong>{languages.length - 1}</strong> Languages
            </div>
          </div>
        )}
      </div>

      {loading && <Spinner />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {!loading && !error && (
        <>
          <div className="projects-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search repositories by name or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="sort-box">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
                <option value="stars">Most Stars</option>
              </select>
            </div>
          </div>

          {/* Language Filter Chips */}
          <div className="filter-chips">
            {languages.map((lang) => (
              <button
                key={lang}
                className={`chip ${selectedLanguage === lang ? "active" : ""}`}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="results-info">
            <span>
              Showing <strong>{filteredRepos.length}</strong> of{" "}
              <strong>{repos.length}</strong> repositories
            </span>
            {(searchTerm || selectedLanguage !== "All") && (
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLanguage("All");
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredRepos.length === 0 ? (
            <div className="no-results">
              <div className="empty-icon">📂</div>
              <h3>No matching repositories</h3>
              <p>No projects match your search query or language filter.</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLanguage("All");
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredRepos.map((repo) => (
                <div className="repo-card" key={repo.id}>
                  <div className="repo-card-header">
                    <div className="repo-title-wrapper">
                      <span className="folder-icon">📁</span>
                      <h2 className="repo-title">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open on GitHub"
                        >
                          {repo.name}
                        </a>
                      </h2>
                    </div>
                    <span className="stars-badge" title="Stars count">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>

                  <p className="repo-desc">
                    {repo.description || "No description provided for this repository."}
                  </p>

                  <div className="repo-meta">
                    {repo.language ? (
                      <span className="lang-tag">
                        <span className="lang-dot"></span>
                        {repo.language}
                      </span>
                    ) : (
                      <span className="lang-tag text-muted">Text</span>
                    )}

                    <span className="forks-tag" title="Forks">
                      🍴 {repo.forks_count}
                    </span>

                    {repo.updated_at && (
                      <span className="date-tag">
                        📅 {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <a
                    className="view-repo-btn"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub <span className="arrow">↗</span>
                  </a>
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