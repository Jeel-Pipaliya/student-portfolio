import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Task from './models/Task.js';
import User from './models/User.js';
import { authMiddleware } from './middleware/auth.js';
import { validateTaskInput, validateAuthInput } from './middleware/validate.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_tasks';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_practical_7_24AIML051';

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

// In-Memory User store for resilient mode
let memoryUsers = [];

// Seed default demo user in memory
(async () => {
  const hashedDemoPw = await bcrypt.hash('password123', 10);
  memoryUsers.push({
    _id: 'usr_demo_24aiml051',
    id: 'usr_demo_24aiml051',
    name: 'Jeel Pipaliya',
    email: 'jeel@portfolio.dev',
    password: hashedDemoPw,
    role: 'developer',
    createdAt: new Date().toISOString()
  });
})();

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

    // Seed default demo user in MongoDB if not exists
    const demoUser = await User.findOne({ email: 'jeel@portfolio.dev' });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Jeel Pipaliya',
        email: 'jeel@portfolio.dev',
        password: hashedPassword,
        role: 'developer'
      });
      console.log(`[MongoDB] Seeded default authentication user: jeel@portfolio.dev / password123`);
    }
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB daemon (${err.message}).`);
    console.warn(`[Resilience] Running in resilient in-memory Mongoose & Auth simulation mode.`);
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

// Global Middleware 4: Content-Type Validation (415) for POST/PUT/PATCH
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
// 3. Authentication Routes (Practical 7 Core Deliverables)
// ============================================================================

// Root API Health & Route Discovery endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Student Portfolio Tasks & JWT Authentication API (Practical 7)',
    version: '3.0.0',
    database: isMongoConnected ? 'MongoDB Connected' : 'Resilient In-Memory Mode',
    auth_endpoints: {
      'POST /register': 'Register a new user account with bcrypt password hashing',
      'POST /login': 'Authenticate user, verify password hash, and receive JWT token (1h expiry)',
      'GET /me': 'Retrieve currently authenticated user profile (JWT Protected)'
    },
    task_endpoints: {
      'GET /tasks': 'Retrieve all project tasks (JWT Protected via Bearer token)',
      'GET /tasks/:id': 'Retrieve a specific task by ID (JWT Protected)',
      'POST /tasks': 'Create a new task with schema & input validation (JWT Protected)',
      'PUT /tasks/:id': 'Update task status/details (JWT Protected)',
      'DELETE /tasks/:id': 'Permanently delete task (JWT Protected)'
    }
  });
});

// POST /register - Register user and hash password with bcrypt
app.post('/register', validateAuthInput, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'An account with this email address already exists.'
        });
      }

      // Hash password using bcrypt (10 salt rounds)
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name ? name.trim() : 'Jeel Pipaliya',
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'developer'
      });

      // Sign JWT Token
      const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(201).json({
        message: 'User registered successfully with bcrypt password hashing',
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      });
    }

    // In-memory fallback
    const memExisting = memoryUsers.find((u) => u.email === normalizedEmail);
    if (memExisting) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'An account with this email address already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = `usr_${Date.now()}`;
    const newUser = {
      _id: newId,
      id: newId,
      name: name ? name.trim() : 'Jeel Pipaliya',
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'developer',
      createdAt: new Date().toISOString()
    };
    memoryUsers.push(newUser);

    const token = jwt.sign(
      { id: newId, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'User registered successfully with bcrypt password hashing',
      token,
      user: {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /login - Verify password with bcrypt.compare and return JWT token
app.post('/login', validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find((u) => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password. Authentication failed.'
      });
    }

    // Compare plain-text password with stored bcrypt hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password. Authentication failed.'
      });
    }

    const userId = user._id ? user._id.toString() : user.id;

    // Generate JWT Token with 1 hour expiration
    const token = jwt.sign(
      { id: userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful. JWT token issued.',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /me - Supplementary Problem 1: Return currently logged-in user from decoded JWT
app.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;

    let user = null;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select('-password');
    } else {
      user = memoryUsers.find((u) => u.id === userId || u._id === userId);
    }

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User profile not found in database.'
      });
    }

    return res.status(200).json({
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 4. JWT-Protected RESTful CRUD Endpoints (Protected by authMiddleware)
// ============================================================================

// GET /tasks - Retrieve all tasks (Protected by JWT Auth)
app.get('/tasks', authMiddleware, async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      const tasksWithLinks = tasks.map((t) => withLinks(t, req));
      return res.status(200).json({
        count: tasks.length,
        database: 'MongoDB',
        authenticatedUser: req.user.email,
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
        authenticatedUser: req.user.email,
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

// GET /tasks/:id - Retrieve single task (Protected by JWT Auth)
app.get('/tasks/:id', authMiddleware, async (req, res, next) => {
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

// POST /tasks - Create task (Protected by JWT Auth & Input Validation Middleware)
app.post('/tasks', authMiddleware, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const taskDoc = new Task({
      title,
      description,
      category,
      priority
    });

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
      const savedTask = await taskDoc.save();
      return res.status(201).json(withLinks(savedTask, req));
    }

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

// PUT /tasks/:id - Update task (Protected by JWT Auth)
app.put('/tasks/:id', authMiddleware, async (req, res, next) => {
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

// DELETE /tasks/:id - Delete task (Protected by JWT Auth)
app.delete('/tasks/:id', authMiddleware, async (req, res, next) => {
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

    const index = memoryTasks.findIndex((t) => t.id == id || t._id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${id} does not exist`
      });
    }

    const [deletedTask] = memoryTasks.splice(index, 1);
    return res.status(200).json({
      message: `Task ${id} deleted successfully`,
      deletedTask: withLinks(deletedTask, req)
    });
  } catch (err) {
    next(err);
  }
});

// Centralized 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error Handler] ${err.name}: ${err.message}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected server exception occurred.'
  });
});

app.listen(PORT, () => console.log(`Task Management & JWT Auth API running on port ${PORT}`));
