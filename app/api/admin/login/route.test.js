import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { POST } from './route.js';

describe('POST /api/admin/login', () => {
  const originalEnv = { ...process.env };

  after(() => {
    for (const key in process.env) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, originalEnv);
  });

  test('successful login', async () => {
    process.env.ADMIN_SECRET = 'secret123';
    const request = {
      json: async () => ({ password: 'secret123' }),
    };

    const response = await POST(request);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.success, true);
  });

  test('failed login with wrong password', async () => {
    process.env.ADMIN_SECRET = 'secret123';
    const request = {
      json: async () => ({ password: 'wrong_password' }),
    };

    const response = await POST(request);
    const data = await response.json();

    assert.strictEqual(response.status, 401);
    assert.strictEqual(data.error, 'Invalid password');
  });

  test('500 error when ADMIN_SECRET is not set', async () => {
    delete process.env.ADMIN_SECRET;
    const request = {
      json: async () => ({ password: 'any' }),
    };

    const response = await POST(request);
    const data = await response.json();

    assert.strictEqual(response.status, 500);
    assert.strictEqual(data.error, 'Server configuration error');
  });

  test('400 error on invalid request body', async () => {
    process.env.ADMIN_SECRET = 'secret123';
    const request = {
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };

    const response = await POST(request);
    const data = await response.json();

    assert.strictEqual(response.status, 400);
    assert.strictEqual(data.error, 'Invalid request');
  });
});
