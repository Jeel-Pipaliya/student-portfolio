/**
 * Central API Client for Full-Stack Integration (Practical 6)
 * Connects React Frontend (port 5173) to Express & MongoDB Backend (port 5000)
 */

export const BASE_URL = 'http://localhost:5000';

/**
 * Common request helper with robust error parsing and JSON negotiation
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Parse JSON body safely
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (data && data.message) ||
        (data && data.error) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netError = new Error(
        `Cannot connect to backend server at ${BASE_URL}. Ensure 'npm run server' is running on port 5000 with CORS enabled.`
      );
      netError.isNetworkError = true;
      throw netError;
    }
    throw err;
  }
}

/**
 * 1. GET /tasks - Retrieve all tasks from MongoDB
 */
export async function getTasks() {
  return request('/tasks', { method: 'GET' });
}

/**
 * 2. GET /tasks/:id - Retrieve single task by ID
 */
export async function getTaskById(id) {
  return request(`/tasks/${id}`, { method: 'GET' });
}

/**
 * 3. POST /tasks - Create a new task in MongoDB
 */
export async function createTask(taskData) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * 4. PUT /tasks/:id - Update an existing task in MongoDB
 */
export async function updateTask(id, updateData) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

/**
 * 5. DELETE /tasks/:id - Delete a task from MongoDB
 */
export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Health check endpoint to verify backend connectivity
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${BASE_URL}/tasks`, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}
