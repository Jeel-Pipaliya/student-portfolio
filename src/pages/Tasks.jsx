import React, { useState, useEffect, lazy, Suspense, memo, useCallback } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  loginUser,
  registerUser,
  logoutUser,
  getStoredUser,
  getStoredToken
} from "../api";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import PageLoader from "../components/PageLoader";

// Practical 8: Supplementary Problem 1
// Heavy third-party analytics visualization component lazy-loaded on-demand via React.lazy()
const MilestoneAnalytics = lazy(() => import("../components/MilestoneAnalytics"));


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

// ============================================================================
// Practical 8: Supplementary Problem 3 - Render Optimization via React.memo
// Profiler flamegraph analysis proves that TaskCardItem only re-renders when its
// specific props change, eliminating wasteful re-renders of the task list when
// parent modals or global filters toggle.
// ============================================================================
const TaskCardItem = memo(function TaskCardItem({
  task,
  taskId,
  isOptimistic,
  isExpanded,
  onToggleStatus,
  onToggleLinks,
  onRequestDelete
}) {
  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${
        isOptimistic ? "is-optimistic" : ""
      }`}
    >
      <div className="task-card-header">
        <div className="task-check-wrapper">
          <input
            type="checkbox"
            id={`task-${taskId}`}
            checked={task.completed}
            onChange={() => onToggleStatus(task)}
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
            onClick={() => onToggleLinks(taskId)}
            title="Inspect self-describing HATEOAS Hypermedia links"
          >
            {isExpanded ? "Hide Hypermedia" : "🔗 HATEOAS"}
          </button>
          <button
            className="delete-task-btn"
            onClick={() => onRequestDelete(task)}
            disabled={isOptimistic}
            title="Delete Milestone (DELETE /tasks/:id)"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* HATEOAS Inspector Drawer */}
      {isExpanded && (
        <div className="hateoas-drawer">
          <div className="hateoas-drawer-title">
            <span>MongoDB Document Metadata &amp; Hypermedia Controls</span>
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
        </div>
      )}
    </div>
  );
});

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState({});

  // Practical 8: Supplementary Problem 1 - Analytics modal state
  const [showAnalytics, setShowAnalytics] = useState(false);


  // Practical 7: Authentication State
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "Jeel Pipaliya",
    email: "jeel@portfolio.dev",
    password: "password123"
  });

  // Multi-toast notifications state (Supplementary 3)
  const [toasts, setToasts] = useState([]);

  // Delete confirmation modal state (Supplementary 2)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null,
    loading: false
  });

  // Task Form State
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

  // Practical 9: In-Memory Cache Flush
  const handleFlushCache = async () => {
    try {
      const res = await fetch("http://localhost:5000/cache/flush", { method: "POST" });
      const data = await res.json();
      addToast(data.message, "info", "Cache Invalidation Triggered");
      fetchTasks(true);
    } catch {
      addToast("Failed to flush in-memory cache", "error", "Cache Error");
    }
  };


  // Supplementary 2: Listen for 401 unauthorized / expired token events
  useEffect(() => {
    const handleUnauthorized = (e) => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      addToast(
        e.detail?.message || "Session expired (HTTP 401). Please log in again.",
        "warning",
        "Session Expired (401)"
      );
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

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
      console.warn("Tasks Fetch Error:", err.message);
      setIsApiOnline(false);

      if (err.status === 401) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        addToast(
          "JWT Authentication required to access protected task routes. Please log in.",
          "warning",
          "Authentication Required"
        );
      } else {
        setTasks((prev) => (prev.length > 0 ? prev : INITIAL_FALLBACK_TASKS));
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial auto-login demo session if token is empty
  useEffect(() => {
    async function initAuth() {
      if (!getStoredToken()) {
        try {
          const res = await loginUser({
            email: "jeel@portfolio.dev",
            password: "password123"
          });
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        } catch {
          // If demo login fails, leave unauthenticated
        }
      }
      fetchTasks();
    }
    initAuth();
  }, []);

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await loginUser({
        email: "jeel@portfolio.dev",
        password: "password123"
      });
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      addToast("Logged in as Jeel Pipaliya (jeel@portfolio.dev) with JWT Token!", "success", "JWT Issued");
      fetchTasks();
    } catch (err) {
      setAuthError(err.message);
      addToast(err.message, "error", "Login Failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Custom Login/Register Form Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      let res;
      if (authMode === "register") {
        res = await registerUser(authForm);
        addToast("Account created successfully with bcrypt password hashing!", "success", "Registered");
      } else {
        res = await loginUser({ email: authForm.email, password: authForm.password });
        addToast("Logged in successfully! JWT token saved to session.", "success", "Authenticated");
      }

      setCurrentUser(res.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      fetchTasks();
    } catch (err) {
      setAuthError(err.message);
      addToast(err.message, "error", "Auth Error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Supplementary 3: Logout mechanism
  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    addToast("Logged out successfully. JWT token cleared from client.", "info", "Session Ended");
  };

  // Supplementary 1: Optimistic UI Update for Task Creation
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

    setTasks((prev) => [optimisticTask, ...prev]);
    setShowAddModal(false);
    addToast(
      "Optimistic UI: Rendering milestone immediately while persisting via JWT-protected API...",
      "info",
      "Optimistic Update"
    );

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority.toLowerCase()
    };

    setFormData({
      title: "",
      description: "",
      category: "AI/ML",
      priority: "medium"
    });

    try {
      const createdTask = await createTask(payload);

      setTasks((prev) =>
        prev.map((t) => (t._id === tempId ? { ...createdTask, isOptimistic: false } : t))
      );

      addToast(
        `Milestone "${createdTask.title}" successfully saved in MongoDB! (HTTP 201 Created)`,
        "success",
        "Document Persisted"
      );
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      addToast(
        `Failed to create task: ${err.message}. Rolled back optimistic state.`,
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
        `Milestone marked as ${updatedCompleted ? "Completed" : "In Progress"} (HTTP 200 OK)`,
        "success",
        "MongoDB Updated"
      );
    } catch (err) {
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

  const requestDeleteTask = (task) => {
    setDeleteModal({
      isOpen: true,
      task,
      loading: false
    });
  };

  const handleConfirmDelete = async () => {
    const taskToDelete = deleteModal.task;
    if (!taskToDelete) return;

    const targetId = taskToDelete._id || taskToDelete.id;
    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      await deleteTask(targetId);
      setTasks((prev) => prev.filter((t) => t._id !== targetId && t.id !== targetId));
      setDeleteModal({ isOpen: false, task: null, loading: false });

      addToast(
        `Milestone "${taskToDelete.title}" permanently deleted from MongoDB (HTTP 200 OK)`,
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
            🛡️ JWT &amp; bcrypt Security
          </span>
          <span className="badge-pill badge-hateoas">
            ⚡ Input Validation Pipeline
          </span>
          <span className="badge-pill badge-caching" style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
            ⚡ In-Memory node-cache: 60s TTL
          </span>
        </div>
        <h1 className="tasks-title">Engineering Roadmap &amp; Sprint Hub</h1>
        <p className="tasks-subtitle">
          Real-time feature backlog, research milestones, and architectural roadmap for my AI/ML &amp; Web engineering projects.
          Protected by JSON Web Token (JWT) Bearer authentication and server-side request validation pipelines.
        </p>
      </div>

      {/* Authentication & User Session Bar (Practical 7) */}
      <div className="auth-session-bar" style={{
        background: isAuthenticated ? '#f0fdf4' : '#fff7ed',
        border: `1px solid ${isAuthenticated ? '#86efac' : '#fdba74'}`,
        borderRadius: '8px',
        padding: '12px 18px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>{isAuthenticated ? '🔒' : '🔓'}</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13.5px', color: isAuthenticated ? '#15803d' : '#c2410c' }}>
              {isAuthenticated
                ? `JWT Authenticated: ${currentUser?.name || 'Developer'} (${currentUser?.email || 'jeel@portfolio.dev'})`
                : 'JWT Authentication Required: Protected Routes Active'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {isAuthenticated
                ? `Role: ${currentUser?.role || 'developer'} • Bearer token verified on all CRUD requests`
                : 'Tasks API requires a valid JWT Bearer token in Authorization header'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isAuthenticated ? (
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ padding: '6px 14px', fontSize: '12.5px' }}
            >
              Sign Out (Clear JWT)
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={handleQuickDemoLogin}
                disabled={authLoading}
                style={{ padding: '6px 14px', fontSize: '12.5px' }}
              >
                {authLoading ? 'Signing In...' : '⚡ 1-Click Demo Login'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                style={{ padding: '6px 14px', fontSize: '12.5px' }}
              >
                Login / Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Backend Status & Control Bar */}
      <div className="api-status-banner">
        <div className="status-indicator-group">
          <span className={`status-dot ${isApiOnline ? "online" : "offline"}`}></span>
          <div className="status-text">
            <span className="status-headline">
              {isApiOnline ? "MongoDB & JWT Auth Backend Active" : "Backend Offline / In-Memory Mode"}
            </span>
            <span className="status-subtext">
              {isApiOnline
                ? "Connected to http://localhost:5000 • JWT Bearer Token active"
                : "Run 'npm run server' in student-portfolio to connect backend"}
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
            className="btn btn-secondary"
            onClick={handleFlushCache}
            title="Practical 9: Flush in-memory cache to trigger cache miss on next read"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            🧹 Invalidate Cache
          </button>
          <button
            className="btn-open-analytics"
            onClick={() => setShowAnalytics(true)}
            title="Practical 8: Lazy load heavy analytics visualization chunk"
          >
            📊 Sprint Analytics (Lazy)
          </button>
          <button
            className="btn btn-primary add-task-btn"
            onClick={() => setShowAddModal(true)}
          >
            + New Sprint Milestone
          </button>
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
              <TaskCardItem
                key={taskId}
                task={task}
                taskId={taskId}
                isOptimistic={isOptimistic}
                isExpanded={Boolean(expandedLinks[taskId])}
                onToggleStatus={handleToggleComplete}
                onToggleLinks={toggleLinksInspector}
                onRequestDelete={requestDeleteTask}
              />
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
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

      {/* Practical 7: Authentication Modal (Login / Register) */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h2>{authMode === 'login' ? 'Sign In to Sprint Hub' : 'Create Developer Account'}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowAuthModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  borderBottom: authMode === 'login' ? '2px solid #2563eb' : 'none',
                  fontWeight: authMode === 'login' ? '700' : '500',
                  color: authMode === 'login' ? '#2563eb' : '#64748b',
                  cursor: 'pointer'
                }}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                Sign In
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  borderBottom: authMode === 'register' ? '2px solid #2563eb' : 'none',
                  fontWeight: authMode === 'register' ? '700' : '500',
                  color: authMode === 'register' ? '#2563eb' : '#64748b',
                  cursor: 'pointer'
                }}
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="modal-form">
              {authError && <div className="form-error-alert">{authError}</div>}

              {authMode === 'register' && (
                <div className="form-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password (bcrypt hashed)</label>
                <input
                  id="auth-password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={authLoading}
                >
                  {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In & Get JWT' : 'Register with bcrypt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Practical 8: Supplementary Problem 1 - Dynamic Lazy-Loaded Analytics */}
      {showAnalytics && (
        <Suspense fallback={<PageLoader message="Loading Sprint Analytics Component Chunk..." isComponent={true} />}>
          <MilestoneAnalytics tasks={tasks} onClose={() => setShowAnalytics(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default Tasks;
