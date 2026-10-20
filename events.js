import { EventEmitter } from 'events';

/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * TaskEvents - Central Event Bus extending Node.js built-in EventEmitter.
 * Provides decoupled background processing without external message broker overhead.
 */
class TaskEvents extends EventEmitter {
  constructor() {
    super();

    // In-memory telemetry and audit buffer
    this.stats = {
      emitted: {
        'task-created': 0,
        'task-deleted': 0,
        'error': 0
      },
      completed: 0,
      errorsCaught: 0
    };

    this.recentLogs = [];
  }

  logEvent(eventName, payload, status = 'DISPATCHED', extra = {}) {
    const entry = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      event: eventName,
      status,
      timestamp: new Date().toISOString(),
      payloadSummary: payload?.title ? `Task: "${payload.title}"` : (payload?.id ? `ID: ${payload.id}` : 'General Event'),
      details: payload,
      ...extra
    };

    this.recentLogs.unshift(entry);
    if (this.recentLogs.length > 50) this.recentLogs.pop();
    return entry;
  }

  incrementEmitted(eventName) {
    if (this.stats.emitted[eventName] !== undefined) {
      this.stats.emitted[eventName]++;
    } else {
      this.stats.emitted[eventName] = 1;
    }
  }

  incrementCompleted() {
    this.stats.completed++;
  }

  incrementErrors() {
    this.stats.errorsCaught++;
  }

  getTelemetry() {
    return {
      service: 'Node.js Native EventEmitter Bus (Practical 10)',
      architecture: 'Event-Driven Non-Blocking Background Processing',
      listenerCounts: {
        'task-created': this.listenerCount('task-created'),
        'task-deleted': this.listenerCount('task-deleted'),
        'error': this.listenerCount('error')
      },
      stats: this.stats,
      recentActivity: this.recentLogs.slice(0, 10)
    };
  }

  clearLogs() {
    this.recentLogs = [];
  }
}

// Singleton event bus instance
export const taskEvents = new TaskEvents();
export default taskEvents;
