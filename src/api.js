/**
 * Central API Client for Full-Stack Integration with JWT Authentication (Practical 6 & 7)
 * Connects React Frontend (port 5173) to Express & MongoDB Backend (port 5000)
 */

export const BASE_URL = 'http://localhost:5000';

const TOKEN_KEY = 'portfolio_auth_token';
const USER_KEY = 'portfolio_auth_user';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const userStr = localStorage.getItem(USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Common request helper with JWT header injection & 401 handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Automatically attach Bearer token if present
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Supplementary 2: Token expiry / 401 handling -> clear token & notify app
      if (response.status === 401) {
        clearAuthSession();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('auth:unauthorized', {
              detail: { message: data?.message || 'Session expired. Please log in again.' }
            })
          );
        }
      }

      const errorMessage =
        (data && data.message) ||
        (data && data.error) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.isExpired = Boolean(data && data.isExpired);
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netError = new Error(
        `Cannot connect to backend server at ${BASE_URL}. Ensure 'npm run server' is running on port 5000.`
      );
      netError.isNetworkError = true;
      throw netError;
    }
    throw err;
  }
}

// ============================================================================
// Authentication API Endpoints (Practical 7)
// ============================================================================

/**
 * POST /register - Register new user account
 */
export async function registerUser({ name, email, password, role = 'developer' }) {
  const data = await request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
  if (data.token) {
    setStoredToken(data.token);
    setStoredUser(data.user);
  }
  return data;
}

/**
 * POST /login - Authenticate with email & password, receives JWT
 */
export async function loginUser({ email, password }) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setStoredToken(data.token);
    setStoredUser(data.user);
  }
  return data;
}

/**
 * GET /me - Supplementary 1: Fetch authenticated user profile using decoded JWT
 */
export async function getCurrentUser() {
  return request('/me', { method: 'GET' });
}

/**
 * Logout - Supplementary 3: Clears JWT token and user profile
 */
export function logoutUser() {
  clearAuthSession();
}

// ============================================================================
// Tasks API Endpoints (JWT-Protected in Practical 7)
// ============================================================================

/**
 * GET /tasks - Retrieve all tasks from MongoDB (JWT-Protected)
 */
export async function getTasks() {
  return request('/tasks', { method: 'GET' });
}

/**
 * GET /tasks/:id - Retrieve single task by ID (JWT-Protected)
 */
export async function getTaskById(id) {
  return request(`/tasks/${id}`, { method: 'GET' });
}

/**
 * POST /tasks - Create a new task (JWT-Protected & Input-Validated)
 */
export async function createTask(taskData) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * PUT /tasks/:id - Update an existing task (JWT-Protected)
 */
export async function updateTask(id, updateData) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

/**
 * DELETE /tasks/:id - Delete a task (JWT-Protected)
 */
export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Check backend health
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${BASE_URL}/`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}


// ============================================================================
// AI Assistant API Endpoints (Practical 13)
// ============================================================================

/**
 * POST /api/ai/generate-description - Auto-generate task description, priority & category
 * Calls backend AI service with rate-limiting and graceful degradation
 */
export async function generateTaskDescription({ title, category }) {
  return request('/api/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify({ title, category }),
  });
}
