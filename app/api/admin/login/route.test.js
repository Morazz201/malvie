import { describe, it } from 'node:test';
import assert from 'node:assert';
import { POST } from './route.js';

describe('Admin Login Route', () => {
  it('should return 500 if ADMIN_SECRET is not set', async () => {
    // backup the env var
    const originalAdminSecret = process.env.ADMIN_SECRET;
    delete process.env.ADMIN_SECRET;

    // Silence console.error for this test
    const originalConsoleError = console.error;
    console.error = () => {};

    const request = {
      json: async () => ({ password: 'some_password' })
    };

    try {
      const response = await POST(request);
      assert.strictEqual(response.status, 500);
      const data = await response.json();
      assert.strictEqual(data.error, 'Server configuration error');
    } finally {
      // restore env var
      if (originalAdminSecret !== undefined) {
        process.env.ADMIN_SECRET = originalAdminSecret;
      } else {
        delete process.env.ADMIN_SECRET;
      }
      console.error = originalConsoleError;
    }
  });

  it('should return 200 for correct password', async () => {
    const originalAdminSecret = process.env.ADMIN_SECRET;
    process.env.ADMIN_SECRET = 'correct_password';

    const request = {
      json: async () => ({ password: 'correct_password' })
    };

    try {
      const response = await POST(request);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert.strictEqual(data.success, true);
    } finally {
      if (originalAdminSecret !== undefined) {
        process.env.ADMIN_SECRET = originalAdminSecret;
      } else {
        delete process.env.ADMIN_SECRET;
      }
    }
  });

  it('should return 401 for incorrect password', async () => {
    const originalAdminSecret = process.env.ADMIN_SECRET;
    process.env.ADMIN_SECRET = 'correct_password';

    const request = {
      json: async () => ({ password: 'wrong_password' })
    };

    try {
      const response = await POST(request);
      assert.strictEqual(response.status, 401);
      const data = await response.json();
      assert.strictEqual(data.error, 'Invalid password');
    } finally {
      if (originalAdminSecret !== undefined) {
        process.env.ADMIN_SECRET = originalAdminSecret;
      } else {
        delete process.env.ADMIN_SECRET;
      }
    }
  });

  it('should return 400 for invalid request body', async () => {
    const originalAdminSecret = process.env.ADMIN_SECRET;
    process.env.ADMIN_SECRET = 'correct_password';

    const request = {
      json: async () => { throw new Error('Invalid JSON'); }
    };

    try {
      const response = await POST(request);
      assert.strictEqual(response.status, 400);
      const data = await response.json();
      assert.strictEqual(data.error, 'Invalid request');
    } finally {
      if (originalAdminSecret !== undefined) {
        process.env.ADMIN_SECRET = originalAdminSecret;
      } else {
        delete process.env.ADMIN_SECRET;
      }
    }
  });
});
