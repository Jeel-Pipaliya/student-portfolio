import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000";

const INITIAL_FALLBACK_TASKS = [
  {
    id: 1,
    title: "SignBridge AI: Train Indian Sign Language Gesture Classifier",
    description: "Optimize MediaPipe hand landmarks and train a lightweight TensorFlow classification model for real-time inference.",
    category: "AI/ML",
    priority: "High",
    completed: true,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/1", method: "GET" },
      update: { href: "http://localhost:5000/tasks/1", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/1", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    id: 2,
    title: "CreditWise: Build Flask Inference Service for Loan Approvals",
    description: "Create an automated pipeline for risk scoring, creditworthiness prediction, and deployment.",
    category: "AI/ML",
    priority: "High",
    completed: false,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/2", method: "GET" },
      update: { href: "http://localhost:5000/tasks/2", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/2", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    id: 3,
    title: "Portfolio: Implement Express REST API and Middleware Pipeline",
    description: "Build robust CRUD endpoints, request logger, content-type checks, and centralized error handling (Practical 4).",
    category: "Web Dev",
    priority: "Medium",
    completed: true,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/3", method: "GET" },
      update: { href: "http://localhost:5000/tasks/3", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/3", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    id: 4,
    title: "Portfolio: Evaluate Richardson Maturity Model (Assignment 1)",
    description: "Analyze endpoints against Levels 0 through 3 and document HATEOAS link structures in MATURITY.md.",
    category: "Documentation",
    priority: "Medium",
    completed: false,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/4", method: "GET" },
      update: { href: "http://localhost:5000/tasks/4", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/4", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  }
];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "AI/ML",
    priority: "Medium"
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (message, type = "success") => {
    setStatusMessage({ message, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Fetch tasks from Express Backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const data = await response.json();
      setTasks(data.tasks || []);
      setIsApiOnline(true);
    } catch {
      // Graceful offline fallback
      setIsApiOnline(false);
      setTasks((prev) => (prev.length > 0 ? prev : INITIAL_FALLBACK_TASKS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Toggle Task Completion (PUT /tasks/:id)
  const handleToggleComplete = async (task) => {
    const updatedCompleted = !task.completed;
    if (isApiOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            completed: updatedCompleted
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to update task: HTTP ${response.status}`);
        }

        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? updatedTask : t))
        );
        showToast(
          `Task #${task.id} updated (HTTP 200 OK): ${updatedCompleted ? "Completed" : "In Progress"}`
        );
      } catch (err) {
        showToast(`Error updating task: ${err.message}`, "error");
      }
    } else {
      // Local client fallback
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: updatedCompleted } : t
        )
      );
      showToast(
        `Task #${task.id} updated locally (Start server with 'npm run server' for live persistence)`
      );
    }
  };

  // Delete Task (DELETE /tasks/:id)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm(`Are you sure you want to delete Task #${taskId}?`)) {
      return;
    }

    if (isApiOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error(`Failed to delete task: HTTP ${response.status}`);
        }

        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        showToast(`Task #${taskId} deleted successfully (HTTP 200 OK)`);
      } catch (err) {
        showToast(`Error deleting task: ${err.message}`, "error");
      }
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast(`Task #${taskId} deleted locally`);
    }
  };

  // Create Task (POST /tasks)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Task title is required.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    if (isApiOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || `HTTP ${response.status}`);
        }

        const createdTask = await response.json();
        setTasks((prev) => [...prev, createdTask]);
        setShowAddModal(false);
        setFormData({
          title: "",
          description: "",
          category: "AI/ML",
          priority: "Medium"
        });
        showToast(
          `Task #${createdTask.id} created successfully (HTTP 201 Created)!`
        );
      } catch (err) {
        setFormError(`Server error: ${err.message}`);
      } finally {
        setFormSubmitting(false);
      }
    } else {
      // Local fallback
      const nextId =
        tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      const newTask = {
        id: nextId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        completed: false,
        createdAt: new Date().toISOString(),
        _links: {
          self: { href: `${API_BASE_URL}/tasks/${nextId}`, method: "GET" },
          update: { href: `${API_BASE_URL}/tasks/${nextId}`, method: "PUT" },
          delete: { href: `${API_BASE_URL}/tasks/${nextId}`, method: "DELETE" },
          collection: { href: `${API_BASE_URL}/tasks`, method: "GET" }
        }
      };

      setTasks((prev) => [...prev, newTask]);
      setShowAddModal(false);
      setFormData({
        title: "",
        description: "",
        category: "AI/ML",
        priority: "Medium"
      });
      setFormSubmitting(false);
      showToast(
        `Task #${nextId} created locally (Start server with 'npm run server' for live persistence)`
      );
    }
  };

  // Toggle HATEOAS links inspector for a task
  const toggleLinksInspector = (taskId) => {
    setExpandedLinks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      selectedCategory === "All" || task.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed);
    return matchesCategory && matchesStatus;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = tasks.filter((t) => t.priority === "High").length;

  return (
    <div className="tasks-page-container">
      {/* Toast Notification */}
      {statusMessage && (
        <div className={`toast-notification ${statusMessage.type}`}>
          <span>{statusMessage.message}</span>
          <button onClick={() => setStatusMessage(null)}>✕</button>
        </div>
      )}

      {/* Header Section */}
      <div className="tasks-header">
        <div className="header-badges">
          <span className="badge-academic">Practical 4: Express RESTful API</span>
          <span className="badge-academic badge-rmm">Assignment 1: Richardson Maturity Model</span>
        </div>
        <h1 className="tasks-title">Portfolio Project Milestones & Tasks</h1>
        <p className="tasks-subtitle">
          Live RESTful API backend built with Node.js and Express featuring full CRUD operations,
          custom middleware pipeline (request logging, Content-Type enforcement, ID validator),
          centralized error handling, and Richardson Maturity Level 3 HATEOAS hypermedia links.
        </p>
      </div>

      {/* API Status Banner */}
      <div className={`api-status-banner ${isApiOnline ? "online" : "offline"}`}>
        <div className="status-indicator-group">
          <span className="status-dot"></span>
          <div>
            <strong>{isApiOnline ? "Live Express REST API Active" : "Express Backend Not Detected"}</strong>
            <p className="status-desc">
              {isApiOnline
                ? `Connected to ${API_BASE_URL} • Global Request Logger & HATEOAS active`
                : "Displaying cached portfolio state. Run `npm run server` in a new terminal to start Express on port 5000."}
            </p>
          </div>
        </div>
        <div className="status-actions">
          <button className="refresh-btn" onClick={fetchTasks} title="Check API Connection">
            🔄 Recheck API
          </button>
          <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
            + Add Milestone Task
          </button>
        </div>
      </div>

      {/* Middleware Pipeline Visualizer */}
      <div className="pipeline-card">
        <div className="pipeline-title">⚡ Express.js Middleware Pipeline Architecture</div>
        <div className="pipeline-flow">
          <div className="pipeline-step step-client">Client Request</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">CORS & Logger</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">JSON Parser</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">Content-Type / ID Validator</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step step-router">Express CRUD Router</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step step-error">404 / 500 Error Handler</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Milestones</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed Tasks</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending In-Progress</div>
        </div>
        <div className="stat-card high-priority">
          <div className="stat-value">{highPriorityCount}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="task-filters-bar">
        <div className="filter-group">
          <span className="filter-label">Category:</span>
          {["All", "AI/ML", "Web Dev", "Documentation"].map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "In Progress" },
            { id: "completed", label: "Completed" }
          ].map((status) => (
            <button
              key={status.id}
              className={`filter-chip ${statusFilter === status.id ? "active" : ""}`}
              onClick={() => setStatusFilter(status.id)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="loading-state">
          <div className="task-spinner"></div>
          <p>Loading project milestone tasks from API...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks match your criteria</h3>
          <p>Try clearing filters or add a new milestone task.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? "task-completed" : ""}`}>
              <div className="task-card-header">
                <div className="task-check-wrapper">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="task-checkbox"
                  />
                  <label htmlFor={`task-${task.id}`} className="task-title-text">
                    {task.title}
                  </label>
                </div>
                <div className="task-badges">
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="category-badge">{task.category}</span>
                </div>
              </div>

              {task.description && <p className="task-desc">{task.description}</p>}

              <div className="task-card-footer">
                <span className="task-id-badge">ID: #{task.id}</span>
                <span className="task-status-pill">
                  {task.completed ? "✓ Done" : "⏳ In Progress"}
                </span>
                <div className="task-actions">
                  <button
                    className="hateoas-toggle-btn"
                    onClick={() => toggleLinksInspector(task.id)}
                    title="Inspect Richardson Level 3 HATEOAS Hypermedia Links"
                  >
                    {expandedLinks[task.id] ? "Hide HATEOAS" : "🔗 Level 3 Links"}
                  </button>
                  <button
                    className="delete-task-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete Task (DELETE /tasks/:id)"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* HATEOAS Inspector Drawer */}
              {expandedLinks[task.id] && (
                <div className="hateoas-drawer">
                  <div className="hateoas-drawer-title">
                    <span>Richardson Maturity Level 3 — Hypermedia Controls (_links)</span>
                    <span className="hateoas-tag">HATEOAS</span>
                  </div>
                  <pre className="hateoas-code">
                    {JSON.stringify(task._links || {}, null, 2)}
                  </pre>
                  <div className="hateoas-drawer-note">
                    Clients navigate state dynamically using these hypermedia URIs without hardcoded route knowledge.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Portfolio Milestone Task</h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="modal-form">
              {formError && <div className="form-error-alert">{formError}</div>}

              <div className="form-group">
                <label htmlFor="task-title">Task Title *</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. SignBridge AI: Optimize MediaPipe Landmark Extraction"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  rows="3"
                  placeholder="Details of the technical objective or milestone..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-category">Category</label>
                  <select
                    id="task-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Cloud/DevOps">Cloud/DevOps</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Creating..." : "Create Task (POST /tasks)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Richardson Maturity Model Info Card */}
      <div className="rmm-card">
        <h3>🏛️ Richardson Maturity Model Compliance (Assignment 1)</h3>
        <p className="rmm-intro">
          This API and interactive dashboard demonstrate compliance with all four levels of the
          Richardson Maturity Model:
        </p>
        <div className="rmm-grid">
          <div className="rmm-level-item">
            <div className="rmm-level-num">Level 0</div>
            <div className="rmm-level-title">The Swamp of POX</div>
            <div className="rmm-level-desc">Single URI, single HTTP verb used as transport tunnel (RPC style). Surpassed.</div>
          </div>
          <div className="rmm-level-item">
            <div className="rmm-level-num">Level 1</div>
            <div className="rmm-level-title">Resources</div>
            <div className="rmm-level-desc">Discrete URIs for individual & collection resources (/tasks, /tasks/:id). Satisfied.</div>
          </div>
          <div className="rmm-level-item">
            <div className="rmm-level-num">Level 2</div>
            <div className="rmm-level-title">HTTP Verbs & Status Codes</div>
            <div className="rmm-level-desc">GET, POST, PUT, DELETE with 200, 201, 400, 404, 415, 500 status codes. Satisfied.</div>
          </div>
          <div className="rmm-level-item active">
            <div className="rmm-level-num">Level 3</div>
            <div className="rmm-level-title">HATEOAS Hypermedia</div>
            <div className="rmm-level-desc">Embeds dynamic _links in representations guiding clients on state transitions. Satisfied!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
