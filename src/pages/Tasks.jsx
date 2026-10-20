import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000";

const INITIAL_FALLBACK_TASKS = [
  {
    id: 1,
    title: "SignBridge AI: Train Real-Time ISL Gesture Recognition Model",
    description: "Optimize MediaPipe hand landmarks and train a lightweight TensorFlow LSTM classifier for sub-50ms inference.",
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
    title: "CreditWise: Architect Flask Inference Service for Automated Risk Scoring",
    description: "Implement automated creditworthiness evaluation pipeline using ensemble gradient boosted trees (LightGBM).",
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
    title: "Portfolio: Build Express REST Engine with Middleware Pipeline",
    description: "Implement centralized request logging, Content-Type negotiation, input sanitization, and structured error boundaries.",
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
    title: "REST Architecture: Deploy HATEOAS Dynamic Hypermedia Controls",
    description: "Implement self-describing RESTful hypermedia contracts (_links) enabling autonomous client-driven resource state transitions.",
    category: "Architecture",
    priority: "Medium",
    completed: true,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/4", method: "GET" },
      update: { href: "http://localhost:5000/tasks/4", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/4", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    id: 5,
    title: "DevOps: Automate Docker Containerization & GitHub CI/CD Workflows",
    description: "Configure automated testing pipelines and multi-stage container builds for rapid deployment.",
    category: "Cloud/DevOps",
    priority: "Medium",
    completed: false,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/5", method: "GET" },
      update: { href: "http://localhost:5000/tasks/5", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/5", method: "DELETE" },
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
          `Milestone #${task.id} updated (HTTP 200 OK): ${updatedCompleted ? "Completed" : "In Progress"}`
        );
      } catch (err) {
        showToast(`Error updating milestone: ${err.message}`, "error");
      }
    } else {
      // Local client fallback
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: updatedCompleted } : t
        )
      );
      showToast(
        `Milestone #${task.id} updated locally (Start backend with 'npm run server' for live persistence)`
      );
    }
  };

  // Delete Task (DELETE /tasks/:id)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm(`Are you sure you want to remove Milestone #${taskId}?`)) {
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
        showToast(`Milestone #${taskId} deleted successfully (HTTP 200 OK)`);
      } catch (err) {
        showToast(`Error deleting milestone: ${err.message}`, "error");
      }
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast(`Milestone #${taskId} removed locally`);
    }
  };

  // Create Task (POST /tasks)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Milestone title is required.");
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
          `Milestone #${createdTask.id} created successfully (HTTP 201 Created)!`
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
        `Milestone #${nextId} created locally (Start backend with 'npm run server' for live persistence)`
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
          <span className="badge-tech">
            <span className="live-dot-inline"></span> Live REST API Microservice
          </span>
          <span className="badge-tech badge-purple">
            🛡️ Middleware Pipeline & Telemetry
          </span>
          <span className="badge-tech badge-cyan">
            🔗 HATEOAS Hypermedia Engine
          </span>
        </div>
        <h1 className="tasks-title">Engineering Roadmap & Sprint Hub</h1>
        <p className="tasks-subtitle">
          Real-time feature backlog, research milestones, and architectural roadmap for my AI/ML & Web
          engineering projects. Interacting live with an asynchronous Express.js REST API featuring centralized
          request telemetry, schema validation, and self-describing HATEOAS discovery.
        </p>
      </div>

      {/* API Status Banner */}
      <div className={`api-status-banner ${isApiOnline ? "online" : "offline"}`}>
        <div className="status-indicator-group">
          <span className="status-dot"></span>
          <div>
            <strong>{isApiOnline ? "Express Backend Microservice Active" : "Backend Microservice Offline"}</strong>
            <p className="status-desc">
              {isApiOnline
                ? `Connected to ${API_BASE_URL} • Live Request Telemetry & HATEOAS Contract Active`
                : "Displaying cached local state. Run `npm run server` in a terminal to activate live Node.js/Express persistence."}
            </p>
          </div>
        </div>
        <div className="status-actions">
          <button className="refresh-btn" onClick={fetchTasks} title="Check API Connection">
            🔄 Recheck Connection
          </button>
          <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
            + New Sprint Milestone
          </button>
        </div>
      </div>

      {/* Middleware Pipeline Visualizer */}
      <div className="pipeline-card">
        <div className="pipeline-title">⚡ Express.js Request-Response Architecture & Telemetry Pipeline</div>
        <div className="pipeline-flow">
          <div className="pipeline-step step-client">Client Request</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">CORS & Telemetry Logger</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">JSON Parser</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">Content-Type & ID Guard</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step step-router">REST CRUD Router</div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step step-error">Error Interceptor</div>
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
          <div className="stat-label">Completed Milestones</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">In-Progress Tasks</div>
        </div>
        <div className="stat-card high-priority">
          <div className="stat-value">{highPriorityCount}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="task-filters-bar">
        <div className="filter-group">
          <span className="filter-label">Domain:</span>
          {["All", "AI/ML", "Web Dev", "Architecture", "Cloud/DevOps"].map((cat) => (
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
          <span className="filter-label">Sprint Status:</span>
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
          <p>Syncing engineering milestones from microservice...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No milestones match your filter</h3>
          <p>Try switching domains or add a new sprint milestone.</p>
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
                <span className="task-id-badge">TASK #{task.id}</span>
                <span className="task-status-pill">
                  {task.completed ? "✓ Delivered" : "⚡ In Sprint"}
                </span>
                <div className="task-actions">
                  <button
                    className="hateoas-toggle-btn"
                    onClick={() => toggleLinksInspector(task.id)}
                    title="Inspect self-describing HATEOAS Hypermedia links"
                  >
                    {expandedLinks[task.id] ? "Hide Hypermedia" : "🔗 Inspect HATEOAS"}
                  </button>
                  <button
                    className="delete-task-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete Milestone (DELETE /tasks/:id)"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>

              {/* HATEOAS Inspector Drawer */}
              {expandedLinks[task.id] && (
                <div className="hateoas-drawer">
                  <div className="hateoas-drawer-title">
                    <span>Self-Describing Hypermedia Controls (_links)</span>
                    <span className="hateoas-tag">HATEOAS Contract</span>
                  </div>
                  <pre className="hateoas-code">
                    {JSON.stringify(task._links || {}, null, 2)}
                  </pre>
                  <div className="hateoas-drawer-note">
                    Decoupled REST client navigation: State transitions are discovered dynamically at runtime via hypermedia links.
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
              <h2>Add Sprint Milestone</h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="modal-form">
              {formError && <div className="form-error-alert">{formError}</div>}

              <div className="form-group">
                <label htmlFor="task-title">Milestone Title *</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. SignBridge AI: Integrate FP16 ONNX Runtime Quantization"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-desc">Technical Objective</label>
                <textarea
                  id="task-desc"
                  rows="3"
                  placeholder="Describe the architectural milestone or deliverable..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-category">Domain</label>
                  <select
                    id="task-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Cloud/DevOps">Cloud/DevOps</option>
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
                  {formSubmitting ? "Dispatching..." : "Commit Milestone (POST /tasks)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESTful Architecture & Maturity Card */}
      <div className="rmm-card">
        <h3>🏛️ RESTful Architecture & Hypermedia Maturity</h3>
        <p className="rmm-intro">
          Designed around the Richardson Maturity Model, demonstrating progressive API capabilities
          from resource-oriented URI design to self-describing HATEOAS discovery:
        </p>
        <div className="rmm-grid">
          <div className="rmm-level-item">
            <div className="rmm-level-num">Level 1</div>
            <div className="rmm-level-title">Uniform Resource URIs</div>
            <div className="rmm-level-desc">Discrete addressable endpoints for collections (/tasks) and individual entities (/tasks/:id).</div>
          </div>
          <div className="rmm-level-item">
            <div className="rmm-level-num">Level 2</div>
            <div className="rmm-level-title">Standard HTTP Verbs & Status</div>
            <div className="rmm-level-desc">Strict semantics for GET, POST, PUT, DELETE paired with deterministic status codes (200, 201, 400, 415, 500).</div>
          </div>
          <div className="rmm-level-item active">
            <div className="rmm-level-num">Level 3</div>
            <div className="rmm-level-title">Hypermedia Controls (HATEOAS)</div>
            <div className="rmm-level-desc">Embeds dynamic _links in JSON representations enabling autonomous, decoupled state transitions.</div>
          </div>
          <div className="rmm-level-item">
            <div className="rmm-level-num">Resilience</div>
            <div className="rmm-level-title">Zero-Leak Error Handling</div>
            <div className="rmm-level-desc">Centralized error boundaries intercept unhandled exceptions and prevent raw stack traces from reaching clients.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
