import { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  checkServerHealth
} from "../api";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

const INITIAL_FALLBACK_TASKS = [
  {
    _id: "671542e191a2bc31a0e8d191",
    id: 1,
    title: "SignBridge AI: Train Real-Time ISL Gesture Recognition Model",
    description: "Optimize MediaPipe hand landmarks and train a lightweight TensorFlow LSTM classifier for sub-50ms inference.",
    category: "AI/ML",
    priority: "high",
    completed: true,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d191", method: "GET" },
      update: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d191", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d191", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    _id: "671542e191a2bc31a0e8d192",
    id: 2,
    title: "CreditWise: Architect Flask Inference Service for Automated Risk Scoring",
    description: "Implement automated creditworthiness evaluation pipeline using ensemble gradient boosted trees (LightGBM).",
    category: "AI/ML",
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d192", method: "GET" },
      update: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d192", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d192", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    _id: "671542e191a2bc31a0e8d193",
    id: 3,
    title: "Portfolio: Build Express REST Engine with Middleware Pipeline",
    description: "Implement centralized request logging, Content-Type negotiation, input sanitization, and structured error boundaries.",
    category: "Web Dev",
    priority: "medium",
    completed: true,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d193", method: "GET" },
      update: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d193", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d193", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    _id: "671542e191a2bc31a0e8d194",
    id: 4,
    title: "REST Architecture: Deploy HATEOAS Dynamic Hypermedia Controls",
    description: "Implement self-describing RESTful hypermedia contracts (_links) enabling autonomous client-driven resource state transitions.",
    category: "Architecture",
    priority: "medium",
    completed: true,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d194", method: "GET" },
      update: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d194", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d194", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  },
  {
    _id: "671542e191a2bc31a0e8d195",
    id: 5,
    title: "DevOps: Automate Docker Containerization & GitHub CI/CD Workflows",
    description: "Configure automated testing pipelines and multi-stage container builds for rapid deployment.",
    category: "Cloud/DevOps",
    priority: "medium",
    completed: false,
    createdAt: new Date().toISOString(),
    _links: {
      self: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d195", method: "GET" },
      update: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d195", method: "PUT" },
      delete: { href: "http://localhost:5000/tasks/671542e191a2bc31a0e8d195", method: "DELETE" },
      collection: { href: "http://localhost:5000/tasks", method: "GET" }
    }
  }
];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState({});

  // Supplementary Problem 3: Multi-toast notifications state
  const [toasts, setToasts] = useState([]);

  // Supplementary Problem 2: Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null,
    loading: false
  });

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "AI/ML",
    priority: "medium"
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Toast Helper
  const addToast = (message, type = "success", title = null, duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch tasks using central API client
  const fetchTasks = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await getTasks();
      const loadedTasks = data.tasks || [];
      setTasks(loadedTasks);
      setIsApiOnline(true);
      if (isManual) {
        addToast(
          `Synced ${loadedTasks.length} milestones directly from MongoDB collection 'tasks'`,
          "success",
          "MongoDB Synced (HTTP 200 OK)"
        );
      }
    } catch (err) {
      console.warn("API Offline / Fallback:", err.message);
      setIsApiOnline(false);
      setTasks((prev) => (prev.length > 0 ? prev : INITIAL_FALLBACK_TASKS));
      if (isManual) {
        addToast(
          "Backend offline. Displaying cached milestones. Start backend with 'npm run server'.",
          "warning",
          "Backend Offline"
        );
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Supplementary Problem 1: Optimistic UI Update for Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Milestone title is required.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    // Create optimistic temporary task
    const tempId = `opt_${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      id: tempId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority.toLowerCase(),
      completed: false,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      _links: {
        self: { href: `http://localhost:5000/tasks/${tempId}`, method: "GET" },
        update: { href: `http://localhost:5000/tasks/${tempId}`, method: "PUT" },
        delete: { href: `http://localhost:5000/tasks/${tempId}`, method: "DELETE" },
        collection: { href: "http://localhost:5000/tasks", method: "GET" }
      }
    };

    // 1. Immediately inject optimistic task into local state & close modal
    setTasks((prev) => [optimisticTask, ...prev]);
    setShowAddModal(false);
    addToast(
      "Optimistic UI: Displaying new milestone immediately while persisting to MongoDB...",
      "info",
      "Optimistic Update"
    );

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority.toLowerCase()
    };

    // Reset form fields
    setFormData({
      title: "",
      description: "",
      category: "AI/ML",
      priority: "medium"
    });

    try {
      // 2. Transmit POST /tasks to MongoDB via central api client
      const createdTask = await createTask(payload);

      // 3. Replace optimistic placeholder with real confirmed MongoDB document
      setTasks((prev) =>
        prev.map((t) => (t._id === tempId ? { ...createdTask, isOptimistic: false } : t))
      );

      addToast(
        `Milestone "${createdTask.title}" successfully persisted in MongoDB! (HTTP 201 Created)`,
        "success",
        "Document Persisted"
      );
    } catch (err) {
      // 4. Rollback optimistic task on failure
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      addToast(
        `Failed to persist milestone: ${err.message}. Rolled back optimistic state.`,
        "error",
        "Rollback Applied"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Task Completion (PUT /tasks/:id)
  const handleToggleComplete = async (task) => {
    const targetId = task._id || task.id;
    const updatedCompleted = !task.completed;

    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) =>
        (t._id === targetId || t.id === targetId)
          ? { ...t, completed: updatedCompleted }
          : t
      )
    );

    try {
      const updatedTask = await updateTask(targetId, { completed: updatedCompleted });
      setTasks((prev) =>
        prev.map((t) => (t._id === targetId || t.id === targetId ? updatedTask : t))
      );
      addToast(
        `Milestone status updated to ${updatedCompleted ? "Completed" : "In Progress"} (HTTP 200 OK)`,
        "success",
        "MongoDB Updated"
      );
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          (t._id === targetId || t.id === targetId)
            ? { ...t, completed: !updatedCompleted }
            : t
        )
      );
      addToast(`Error updating milestone: ${err.message}`, "error", "Update Failed");
    }
  };

  // Supplementary Problem 2: Open Confirmation Dialog before deletion
  const requestDeleteTask = (task) => {
    setDeleteModal({
      isOpen: true,
      task,
      loading: false
    });
  };

  // Execute deletion after confirmation
  const handleConfirmDelete = async () => {
    const taskToDelete = deleteModal.task;
    if (!taskToDelete) return;

    const targetId = taskToDelete._id || taskToDelete.id;
    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      await deleteTask(targetId);

      // Remove from state
      setTasks((prev) => prev.filter((t) => t._id !== targetId && t.id !== targetId));
      setDeleteModal({ isOpen: false, task: null, loading: false });

      addToast(
        `Milestone "${taskToDelete.title}" permanently removed from MongoDB (HTTP 200 OK)`,
        "success",
        "Task Deleted"
      );
    } catch (err) {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
      addToast(`Failed to delete milestone: ${err.message}`, "error", "Delete Failed");
    }
  };

  const toggleLinksInspector = (taskId) => {
    setExpandedLinks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Filter tasks by domain and completion status
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
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const highPriorityCount = tasks.filter(
    (t) => (t.priority || "").toLowerCase() === "high"
  ).length;

  return (
    <div className="tasks-page">
      {/* Toast Notifications Container (Supplementary 3) */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      {/* Delete Confirmation Modal (Supplementary 2) */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        taskTitle={deleteModal.task?.title}
        taskId={deleteModal.task?._id || deleteModal.task?.id}
        loading={deleteModal.loading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, task: null, loading: false })}
      />

      {/* Page Header */}
      <div className="tasks-header">
        <div className="tasks-badge-group">
          <span className="badge-pill badge-primary">
            ● Full Stack MongoDB Microservice
          </span>
          <span className="badge-pill badge-middleware">
            🛡️ Centralized api.js Client
          </span>
          <span className="badge-pill badge-hateoas">
            ⚡ Optimistic UI & Toasts
          </span>
        </div>
        <h1 className="tasks-title">Engineering Roadmap & Sprint Hub</h1>
        <p className="tasks-subtitle">
          Real-time feature backlog, research milestones, and architectural roadmap for my AI/ML & Web engineering projects.
          Connected directly to an Express.js backend with Mongoose ODM and MongoDB persistence.
        </p>
      </div>

      {/* Backend Status & Control Bar */}
      <div className="api-status-banner">
        <div className="status-indicator-group">
          <span className={`status-dot ${isApiOnline ? "online" : "offline"}`}></span>
          <div className="status-text">
            <span className="status-headline">
              {isApiOnline ? "MongoDB & Express Backend Active" : "Backend Offline (In-Memory Simulation)"}
            </span>
            <span className="status-subtext">
              {isApiOnline
                ? "Connected to http://localhost:5000 • MongoDB 'portfolio_tasks' database active"
                : "Run 'npm run server' in student-portfolio to connect live MongoDB database"}
            </span>
          </div>
        </div>

        <div className="api-actions">
          <button
            className="btn btn-secondary recheck-btn"
            onClick={() => fetchTasks(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? "⏳ Syncing MongoDB..." : "🔄 Verify Persistence"}
          </button>
          <button
            className="btn btn-primary add-task-btn"
            onClick={() => setShowAddModal(true)}
          >
            + New Sprint Milestone
          </button>
        </div>
      </div>

      {/* Architecture Visualizer Banner */}
      <div className="middleware-visualizer-card">
        <div className="visualizer-header">
          <span className="visualizer-title">⚡ FULL-STACK REQUEST-RESPONSE PIPELINE (PRACTICAL 6)</span>
        </div>
        <div className="pipeline-steps">
          <div className="pipeline-step client-step">
            <span className="step-name">React UI</span>
            <span className="step-desc">Port 5173</span>
          </div>
          <span className="pipeline-arrow">➔</span>
          <div className="pipeline-step">
            <span className="step-name">src/api.js</span>
            <span className="step-desc">Central Client</span>
          </div>
          <span className="pipeline-arrow">➔</span>
          <div className="pipeline-step">
            <span className="step-name">Express CORS</span>
            <span className="step-desc">Origin Guard</span>
          </div>
          <span className="pipeline-arrow">➔</span>
          <div className="pipeline-step">
            <span className="step-name">Mongoose ODM</span>
            <span className="step-desc">Schema & Hooks</span>
          </div>
          <span className="pipeline-arrow">➔</span>
          <div className="pipeline-step mongo-step">
            <span className="step-name">MongoDB</span>
            <span className="step-desc">tasks collection</span>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats Cards */}
      <div className="task-stats-grid">
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
          <p>Syncing engineering milestones from MongoDB microservice...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No milestones match your filter</h3>
          <p>Try switching domains or add a new sprint milestone.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => {
            const taskId = task._id || task.id;
            const isOptimistic = Boolean(task.isOptimistic);

            return (
              <div
                key={taskId}
                className={`task-card ${task.completed ? "task-completed" : ""} ${
                  isOptimistic ? "is-optimistic" : ""
                }`}
              >
                <div className="task-card-header">
                  <div className="task-check-wrapper">
                    <input
                      type="checkbox"
                      id={`task-${taskId}`}
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      disabled={isOptimistic}
                      className="task-checkbox"
                    />
                    <label htmlFor={`task-${taskId}`} className="task-title-text">
                      {task.title}
                    </label>
                  </div>
                  <div className="task-badges">
                    {isOptimistic && (
                      <span className="optimistic-badge">⏳ Persisting...</span>
                    )}
                    <span
                      className={`priority-badge priority-${(task.priority || "medium").toLowerCase()}`}
                    >
                      {task.priority || "medium"}
                    </span>
                    <span className="category-badge">{task.category || "General"}</span>
                  </div>
                </div>

                {task.description && <p className="task-desc">{task.description}</p>}

                <div className="task-card-footer">
                  <span className="task-id-badge" title={`MongoDB ObjectId: ${task._id || task.id}`}>
                    ID: {(task._id || String(task.id)).substring(0, 10)}...
                  </span>
                  <span className="task-status-pill">
                    {task.completed ? "✓ Delivered" : "⚡ In Sprint"}
                  </span>
                  <div className="task-actions">
                    <button
                      className="hateoas-toggle-btn"
                      onClick={() => toggleLinksInspector(taskId)}
                      title="Inspect self-describing HATEOAS Hypermedia links"
                    >
                      {expandedLinks[taskId] ? "Hide Hypermedia" : "🔗 HATEOAS"}
                    </button>
                    <button
                      className="delete-task-btn"
                      onClick={() => requestDeleteTask(task)}
                      disabled={isOptimistic}
                      title="Delete Milestone (DELETE /tasks/:id)"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* HATEOAS Inspector Drawer */}
                {expandedLinks[taskId] && (
                  <div className="hateoas-drawer">
                    <div className="hateoas-drawer-title">
                      <span>MongoDB Document Metadata & Hypermedia Controls</span>
                      <span className="hateoas-tag">MongoDB BSON</span>
                    </div>
                    <pre className="hateoas-code">
                      {JSON.stringify(
                        {
                          _id: task._id,
                          title: task.title,
                          category: task.category,
                          priority: task.priority,
                          completed: task.completed,
                          createdAt: task.createdAt,
                          _links: task._links
                        },
                        null,
                        2
                      )}
                    </pre>
                    <div className="hateoas-drawer-note">
                      Decoupled REST client navigation: State transitions are discovered dynamically at runtime via hypermedia links.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal (Optimistic UI Enabled) */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Sprint Milestone</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-desc">Technical Objective</label>
                <textarea
                  id="task-desc"
                  rows="3"
                  placeholder="Describe architectural challenges, libraries, or expected outcomes..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-cat">Engineering Domain</label>
                  <select
                    id="task-cat"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Cloud/DevOps">Cloud/DevOps</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="task-priority">Priority (Enum)</label>
                  <select
                    id="task-priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Persisting to MongoDB..." : "Create Milestone (Optimistic)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
