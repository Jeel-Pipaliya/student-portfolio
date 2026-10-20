import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// 1. In-Memory Data Store (Portfolio Project Tasks)
// ============================================================================
let tasks = [
  {
    id: 1,
    title: 'SignBridge AI: Train Indian Sign Language Gesture Classifier',
    description: 'Optimize MediaPipe hand landmarks and train a lightweight TensorFlow classification model.',
    category: 'AI/ML',
    priority: 'High',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'CreditWise: Build Flask Inference Service for Loan Approvals',
    description: 'Create an automated pipeline for risk scoring and creditworthiness prediction.',
    category: 'AI/ML',
    priority: 'High',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Portfolio: Implement Express REST API and Middleware Pipeline',
    description: 'Build robust CRUD endpoints, request logger, content-type checks, and error handling.',
    category: 'Web Dev',
    priority: 'Medium',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Portfolio: Evaluate Richardson Maturity Model (A1)',
    description: 'Analyze endpoints against Levels 0 through 3 and document HATEOAS link structures.',
    category: 'Documentation',
    priority: 'Medium',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Helper to append Level 3 HATEOAS hypermedia links
const withLinks = (task, req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return {
    ...task,
    _links: {
      self: { href: `${baseUrl}/tasks/${task.id}`, method: 'GET' },
      update: { href: `${baseUrl}/tasks/${task.id}`, method: 'PUT' },
      delete: { href: `${baseUrl}/tasks/${task.id}`, method: 'DELETE' },
      collection: { href: `${baseUrl}/tasks`, method: 'GET' }
    }
  };
};

// ============================================================================
// 2. Global Middleware Pipeline
// ============================================================================

// Global Middleware 1: CORS (Allows React frontend at port 5173 to access API)
app.use(cors());

// Global Middleware 2: Request Logger (Logs Method, URL, and Timestamp)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Global Middleware 3: JSON Body Parser
app.use(express.json());

// Global Middleware 4 (Supplementary): Content-Type validation on POST/PUT/PATCH
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json for POST and PUT requests'
      });
    }
  }
  next();
});

// ============================================================================
// 3. Route-Specific Middleware (Supplementary ID Validator)
// ============================================================================
const validateTaskId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Task ID must be a positive integer'
    });
  }
  req.taskId = id;
  next();
};

// ============================================================================
// 4. RESTful API Routes (CRUD Operations)
// ============================================================================

// Root API Health & Route Discovery endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Student Portfolio Project Tasks API (Practical 4 & A1)',
    version: '1.0.0',
    endpoints: {
      'GET /tasks': 'Retrieve all project tasks',
      'GET /tasks/:id': 'Retrieve a specific task by ID',
      'POST /tasks': 'Create a new task (requires JSON body with title)',
      'PUT /tasks/:id': 'Update an existing task by ID',
      'DELETE /tasks/:id': 'Remove a task by ID'
    }
  });
});

// GET /tasks - Retrieve all tasks (Level 2 + Level 3 HATEOAS support)
app.get('/tasks', (req, res) => {
  const tasksWithLinks = tasks.map((t) => withLinks(t, req));
  res.status(200).json({
    count: tasks.length,
    tasks: tasksWithLinks,
    _links: {
      self: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'GET' },
      create: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'POST' }
    }
  });
});

// GET /tasks/:id - Retrieve a single task by ID
app.get('/tasks/:id', validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task with ID ${req.taskId} does not exist`
    });
  }
  res.status(200).json(withLinks(task, req));
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Validation failed: title is required and cannot be empty'
    });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask = {
    id: nextId,
    title: title.trim(),
    description: description ? description.trim() : '',
    category: category ? category.trim() : 'General',
    priority: priority ? priority.trim() : 'Medium',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(withLinks(newTask, req));
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.taskId);
  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task with ID ${req.taskId} does not exist`
    });
  }

  const { title, description, category, priority, completed } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Validation failed: title must be a non-empty string'
    });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title.trim() : tasks[taskIndex].title,
    description: description !== undefined ? description.trim() : tasks[taskIndex].description,
    category: category !== undefined ? category.trim() : tasks[taskIndex].category,
    priority: priority !== undefined ? priority.trim() : tasks[taskIndex].priority,
    completed: completed !== undefined ? Boolean(completed) : tasks[taskIndex].completed,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json(withLinks(tasks[taskIndex], req));
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.taskId);
  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task with ID ${req.taskId} does not exist`
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({
    message: `Task ${req.taskId} deleted successfully`,
    deletedTask: withLinks(deletedTask, req)
  });
});

// Deliberate test error endpoint for verifying global error handler
app.get('/test-error', (req, res, next) => {
  const testError = new Error('Simulated internal server exception for Practical 4 verification');
  next(testError);
});

// ============================================================================
// 5. Undefined Route 404 Handler Middleware
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// ============================================================================
// 6. Global Error Handling Middleware (Must be defined last)
// ============================================================================
app.use((err, req, res, next) => {
  console.error(`[Error Handler] ${err.name}: ${err.message}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Task Management API running on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
});
