import { taskEvents } from './events.js';

/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Background event listeners registered to taskEvents singleton.
 * Handles non-blocking notification dispatch, deletion audit, and error boundary handling.
 */

// Helper to delay execution asynchronously without blocking the event loop
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 1. Primary Listener: 'task-created'
// Dispatches background notifications (email / webhook simulation)
// ============================================================================
taskEvents.on('task-created', async (task) => {
  const startTimestamp = new Date().toISOString();
  taskEvents.incrementEmitted('task-created');
  
  const assignedUser = task.assignedTo || 'jeel@charusat.edu.in';
  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`[Notification Worker] 🔔 Background processing started for: "${task.title}"`);
  console.log(`[Notification Worker] 👤 Assigned User: ${assignedUser}`);
  console.log(`[Notification Worker] ⏱️  Processing initiated at: ${startTimestamp}`);
  console.log(`[Notification Worker] ⚡ Note: Main API HTTP 201 response was already delivered to client!`);
  console.log(`--------------------------------------------------------------------------------`);

  taskEvents.logEvent('task-created', task, 'PROCESSING', {
    startedAt: startTimestamp,
    assignedUser
  });

  try {
    // Supplementary Problem 2 Check: Trigger deliberate error if requested
    if (task.title && task.title.includes('[TRIGGER_ERROR]')) {
      throw new Error(`Simulated background worker exception for task "${task.title}" (testing error handling)`);
    }

    // Supplementary Problem 3: Simulate slow notification handler (2000ms delay)
    // Simulates remote SMTP email dispatch, push notification, or external webhook
    await delay(2000);

    const completionTimestamp = new Date().toISOString();
    taskEvents.incrementCompleted();

    console.log(`\n================================================================================`);
    console.log(`[Notification Worker] ✅ Background task notification dispatched successfully!`);
    console.log(`[Notification Worker] 📋 Task: "${task.title}" (ID: ${task._id || task.id})`);
    console.log(`[Notification Worker] 📧 Notification sent to: ${assignedUser}`);
    console.log(`[Notification Worker] ⏱️  Completed at: ${completionTimestamp} (+2000ms after API response)`);
    console.log(`================================================================================\n`);

    taskEvents.logEvent('task-created', task, 'COMPLETED', {
      startedAt: startTimestamp,
      completedAt: completionTimestamp,
      durationMs: 2000,
      assignedUser
    });

  } catch (err) {
    // Supplementary Problem 2: Delegate error to central 'error' listener
    taskEvents.emit('error', err, { context: 'task-created listener', taskTitle: task.title });
  }
});

// ============================================================================
// 2. Supplementary Problem 1: 'task-deleted'
// Dispatches background audit logging on task deletion
// ============================================================================
taskEvents.on('task-deleted', async (data) => {
  const startTimestamp = new Date().toISOString();
  taskEvents.incrementEmitted('task-deleted');

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`[Audit Worker] 🗑️  Task Deletion Event received for Task ID: ${data.id}`);
  console.log(`[Audit Worker] 📋 Deleted Task Title: "${data.title}"`);
  console.log(`[Audit Worker] 👤 Initiated By: ${data.deletedBy || 'System Admin'}`);
  console.log(`[Audit Worker] ⏱️  Audit recorded at: ${startTimestamp}`);
  console.log(`--------------------------------------------------------------------------------`);

  taskEvents.logEvent('task-deleted', data, 'PROCESSING', {
    startedAt: startTimestamp
  });

  try {
    // Simulate asynchronous audit trail write to archive/analytics (1000ms delay)
    await delay(1000);

    const completionTimestamp = new Date().toISOString();
    taskEvents.incrementCompleted();

    console.log(`\n================================================================================`);
    console.log(`[Audit Worker] ✅ Task deletion audit trail successfully recorded in archive!`);
    console.log(`[Audit Worker] 🗑️  Archived Task ID: ${data.id} ("${data.title}")`);
    console.log(`[Audit Worker] ⏱️  Completed at: ${completionTimestamp} (+1000ms after API response)`);
    console.log(`================================================================================\n`);

    taskEvents.logEvent('task-deleted', data, 'COMPLETED', {
      startedAt: startTimestamp,
      completedAt: completionTimestamp,
      durationMs: 1000
    });

  } catch (err) {
    taskEvents.emit('error', err, { context: 'task-deleted listener', taskId: data.id });
  }
});

// ============================================================================
// 3. Supplementary Problem 2: 'error'
// Centralized Error Boundary Listener for EventEmitter
// Special Node.js rule: Unhandled 'error' events will throw and crash the server.
// Registering this listener prevents crashes and logs gracefully.
// ============================================================================
taskEvents.on('error', (err, metadata = {}) => {
  const errorTimestamp = new Date().toISOString();
  taskEvents.incrementErrors();

  console.error(`\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  console.error(`[Event Error Handler] ⚠️  CAUGHT BACKGROUND EVENT ERROR GRACEFULLY:`);
  console.error(`[Event Error Handler] 💥 Message: ${err.message}`);
  console.error(`[Event Error Handler] 📍 Context: ${metadata.context || 'Unknown EventEmitter Context'}`);
  console.error(`[Event Error Handler] ⏱️  Timestamp: ${errorTimestamp}`);
  console.error(`[Event Error Handler] 🛡️  Server process protected: Server remains healthy and operational!`);
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n`);

  taskEvents.logEvent('error', { message: err.message, stack: err.stack }, 'ERROR_HANDLED', {
    errorTimestamp,
    metadata
  });
});

console.log('[TaskEvents] ✅ All background event listeners initialized (task-created, task-deleted, error).');

export default taskEvents;
