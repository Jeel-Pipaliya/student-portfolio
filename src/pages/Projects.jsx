import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch("https://api.github.com/users/Jeel-Pipaliya/repos?sort=updated")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API responded with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error("Invalid response format received from GitHub");
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

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section className="page">
      <div className="projects-header">
        <h1>My Projects</h1>
        <p className="subtitle">
          Dynamic projects and repositories fetched in real-time from GitHub REST API
        </p>
      </div>

      {loading && <Spinner />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {!loading && !error && (
        <>
          <div className="projects-toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search repositories by name or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="repo-count">
              Showing {filteredRepos.length} of {repos.length} repositories
            </span>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="no-results">
              <p>No repositories match your search query: "{searchTerm}".</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredRepos.map((repo) => (
                <div className="repo-card" key={repo.id}>
                  <div className="repo-card-header">
                    <h2 className="repo-title">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                    </h2>
                    <span className="stars-badge" title="GitHub Stars">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>

                  <p className="repo-desc">
                    {repo.description || "No description provided for this repository."}
                  </p>

                  <div className="repo-meta">
                    {repo.language && (
                      <span className="lang-tag">{repo.language}</span>
                    )}
                    <span className="forks-tag" title="Forks">
                      🍴 {repo.forks_count}
                    </span>
                    {repo.updated_at && (
                      <span className="date-tag">
                        Updated: {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <a
                    className="view-repo-btn"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub →
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