/**
 * Request Input Validation Middleware for Practical 7
 * Rejects malformed requests before they reach the controller/database
 */

export function validateTaskInput(req, res, next) {
  const { title, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title is required and cannot be empty.',
      field: 'title'
    });
  }

  if (title.trim().length < 2) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title must be at least 2 characters long.',
      field: 'title'
    });
  }

  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high', 'Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Priority must be either low, medium, or high.',
        field: 'priority'
      });
    }
  }

  next();
}

export function validateAuthInput(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'A valid email address is required.',
      field: 'email'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Password is required and must be at least 6 characters long.',
      field: 'password'
    });
  }

  next();
}
