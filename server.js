import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import Task from './models/Task.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_tasks';

let isMongoConnected = false;

// Initial portfolio milestone seeds
const INITIAL_SEEDS = [
  {
    title: 'SignBridge AI: Train Real-Time ISL Gesture Recognition Model',
    description: 'Optimize MediaPipe hand landmarks and train a lightweight TensorFlow LSTM classifier for sub-50ms inference.',
    category: 'AI/ML',
    priority: 'high',
    completed: true
  },
  {
    title: 'CreditWise: Architect Flask Inference Service for Automated Risk Scoring',
    description: 'Implement automated creditworthiness evaluation pipeline using ensemble gradient boosted trees (LightGBM).',
    category: 'AI/ML',
    priority: 'high',
    completed: false
  },
  {
    title: 'Portfolio: Build Express REST Engine with Middleware Pipeline',
    description: 'Implement centralized request logging, Content-Type negotiation, input sanitization, and structured error boundaries.',
    category: 'Web Dev',
    priority: 'medium',
    completed: true
  },
  {
    title: 'REST Architecture: Deploy HATEOAS Dynamic Hypermedia Controls',
    description: 'Implement self-describing RESTful hypermedia contracts (_links) enabling autonomous client-driven resource state transitions.',
    category: 'Architecture',
    priority: 'medium',
    completed: true
  },
  {
    title: 'DevOps: Automate Docker Containerization & GitHub CI/CD Workflows',
    description: 'Configure automated testing pipelines and multi-stage container builds for rapid deployment.',
    category: 'Cloud/DevOps',
    priority: 'medium',
    completed: false
  }
];

// In-Memory resilient fallback store if MongoDB daemon is offline
let memoryTasks = INITIAL_SEEDS.map((s, index) => ({
  ...s,
  _id: `mem_${index + 1}`,
  id: index + 1,
  createdAt: new Date().toISOString()
}));

// ============================================================================
// 1. MongoDB Database Connection with Mongoose ODM
// ============================================================================
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);

    // Seed initial milestones if collection is empty
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(INITIAL_SEEDS);
      console.log(`[MongoDB] Seeded ${INITIAL_SEEDS.length} initial portfolio milestones.`);
    }
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB daemon (${err.message}).`);
    console.warn(`[Resilience] Running in resilient in-memory Mongoose simulation mode.`);
  }
}

connectDB();

// Helper to append Level 3 HATEOAS hypermedia links
const withLinks = (task, req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const taskId = task._id ? task._id.toString() : task.id;
  const taskObj = task.toObject ? task.toObject({ virtuals: true }) : { ...task, id: taskId };

  return {
    ...taskObj,
    id: taskId,
    _links: {
      self: { href: `${baseUrl}/tasks/${taskId}`, method: 'GET' },
      update: { href: `${baseUrl}/tasks/${taskId}`, method: 'PUT' },
      delete: { href: `${baseUrl}/tasks/${taskId}`, method: 'DELETE' },
      collection: { href: `${baseUrl}/tasks`, method: 'GET' }
    }
  };
};

// ============================================================================
// 2. Global Middleware Pipeline
// ============================================================================

// Global Middleware 1: CORS
app.use(cors());

// Global Middleware 2: Request Logger (Logs Method, URL, and Timestamp)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Global Middleware 3: JSON Body Parser
app.use(express.json());

// Global Middleware 4: Supplementary Content-Type Validation (415)
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
// 3. RESTful CRUD Endpoints with Mongoose Model Methods
// ============================================================================

// Root API Health & Route Discovery endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Student Portfolio Tasks & MongoDB Mongoose API (Practical 5)',
    version: '2.0.0',
    database: isMongoConnected ? 'MongoDB Connected' : 'Resilient In-Memory Mode',
    endpoints: {
      'GET /tasks': 'Retrieve all project tasks from MongoDB',
      'GET /tasks/:id': 'Retrieve a specific task by MongoDB ObjectId',
      'POST /tasks': 'Create a new task with Mongoose schema validation & pre-save hook',
      'PUT /tasks/:id': 'Update an existing task with schema validators',
      'DELETE /tasks/:id': 'Remove a task by ID from MongoDB'
    }
  });
});

// GET /tasks - Retrieve all tasks (Mongoose Task.find())
app.get('/tasks', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      const tasksWithLinks = tasks.map((t) => withLinks(t, req));
      return res.status(200).json({
        count: tasks.length,
        database: 'MongoDB',
        tasks: tasksWithLinks,
        _links: {
          self: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'GET' },
          create: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'POST' }
        }
      });
    } else {
      const tasksWithLinks = memoryTasks.map((t) => withLinks(t, req));
      return res.status(200).json({
        count: memoryTasks.length,
        database: 'Resilient Memory',
        tasks: tasksWithLinks,
        _links: {
          self: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'GET' },
          create: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'POST' }
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Retrieve single task (Mongoose Task.findById())
// Supplementary Problem 3: Return structured 404 JSON if ID does not exist
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Task with ID ${id} does not exist in database`
        });
      }
      return res.status(200).json(withLinks(task, req));
    }

    // In-memory or non-ObjectId fallback
    const memTask = memoryTasks.find((t) => t.id == id || t._id === id);
    if (!memTask) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${id} does not exist`
      });
    }
    return res.status(200).json(withLinks(memTask, req));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} does not exist`
      });
    }
    next(err);
  }
});

// POST /tasks - Create task (Mongoose Task.create() / new Task().save())
// Enforces required title, enum priority, and pre-save title trim hook
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    // Schema-level validation check via Mongoose Model
    const taskDoc = new Task({
      title,
      description,
      category,
      priority
    });

    // Validate using Mongoose schema validation rules
    try {
      await taskDoc.validate();
    } catch (validationError) {
      const formattedErrors = Object.keys(validationError.errors).map(
        (key) => validationError.errors[key].message
      );
      return res.status(400).json({
        error: 'Validation Error',
        message: formattedErrors.join(', '),
        fields: Object.keys(validationError.errors)
      });
    }

    if (isMongoConnected) {
      // .save() executes Mongoose pre-save trim hook automatically!
      const savedTask = await taskDoc.save();
      return res.status(201).json(withLinks(savedTask, req));
    }

    // In-memory fallback with pre-save trim applied
    const nextId = memoryTasks.length > 0 ? Math.max(...memoryTasks.map((t) => Number(t.id) || 0)) + 1 : 1;
    const newTask = {
      _id: `mem_${nextId}`,
      id: nextId,
      title: title ? title.trim() : '',
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      priority: priority ? priority.trim().toLowerCase() : 'medium',
      completed: false,
      createdAt: new Date().toISOString()
    };
    memoryTasks.push(newTask);
    return res.status(201).json(withLinks(newTask, req));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        error: 'Validation Error',
        message: messages.join(', '),
        details: messages
      });
    }
    next(err);
  }
});

// PUT /tasks/:id - Update task (Mongoose Task.findByIdAndUpdate())
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, completed } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category.trim();
    if (priority !== undefined) updates.priority = priority.toLowerCase();
    if (completed !== undefined) updates.completed = Boolean(completed);

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updatedTask = await Task.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!updatedTask) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Task with ID ${id} does not exist in database`
        });
      }
      return res.status(200).json(withLinks(updatedTask, req));
    }

    // In-memory fallback
    const index = memoryTasks.findIndex((t) => t.id == id || t._id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${id} does not exist`
      });
    }

    memoryTasks[index] = {
      ...memoryTasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json(withLinks(memoryTasks[index], req));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        error: 'Validation Error',
        message: messages.join(', ')
      });
    }
    if (err.name === 'CastError') {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} does not exist`
      });
    }
    next(err);
  }
});

// DELETE /tasks/:id - Delete task (Mongoose Task.findByIdAndDelete())
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Task with ID ${id} does not exist in database`
        });
      }
      return res.status(200).json({
        message: `Task ${id} deleted successfully from MongoDB`,
        deletedTask: withLinks(deletedTask, req)
      });
    }

    // In-memory fallback
    const index = memoryTasks.findIndex((t) => t.id == id || t._id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${id} does not exist`
      });
    }

    const deleted = memoryTasks.splice(index, 1)[0];
    return res.status(200).json({
      message: `Task ${id} deleted successfully`,
      deletedTask: withLinks(deleted, req)
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} does not exist`
      });
    }
    next(err);
  }
});

// Deliberate test error endpoint for verifying global error handler
app.get('/test-error', (req, res, next) => {
  next(new Error('Simulated internal server exception for Practical 5 verification'));
});

// Undefined Route 404 Handler Middleware
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Global Error Handling Middleware (4 arguments)
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
