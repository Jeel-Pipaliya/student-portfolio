import test, { describe, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret-key-2025';
const testToken = jwt.sign({ id: 'ci-test-user-id', username: 'ci-runner', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });

describe('Practical 12: CI/CD Automated API Test Suite', () => {
  after(() => {
    // Gracefully exit test runner after server handles complete
    setTimeout(() => {
      process.exit(0);
    }, 100);
  });

  test('1. Primary Endpoint Test: GET /tasks with JWT returns HTTP 200', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${testToken}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof res.body, 'object');
    assert.ok(Array.isArray(res.body.tasks || res.body), 'Tasks should be returned as an array');
  });

  test('2. Security Boundary Test: GET /tasks without token returns HTTP 401', async () => {
    const res = await request(app).get('/tasks');
    assert.strictEqual(res.status, 401);
  });

  test('3. Supplementary Endpoint Test: GET /events/stats returns HTTP 200 telemetry', async () => {
    const res = await request(app).get('/events/stats');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.service, 'Node.js Native EventEmitter Bus (Practical 10)');
    assert.ok(res.body.listenerCounts, 'Must include listener counts object');
    assert.strictEqual(typeof res.body.stats, 'object');
  });

  test('4. Cache Telemetry Test: GET /cache/stats returns HTTP 200 and hit/miss metrics', async () => {
    const res = await request(app).get('/cache/stats');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.service, 'NodeCache In-Memory Engine');
    assert.strictEqual(typeof res.body.ttlSeconds, 'number');
  });

  test('5. Error Boundary Test: GET /invalid-route returns HTTP 404 with structured JSON', async () => {
    const res = await request(app).get('/api/non-existent-endpoint-404');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(typeof res.body.message, 'string');
  });
});
