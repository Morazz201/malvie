import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { POST } from '../../../../app/api/admin/login/route.js';

describe('Admin Login API', () => {
  let originalAdminSecret;

  // Setup before tests
  before(() => {
    originalAdminSecret = process.env.ADMIN_SECRET;
  });

  // Cleanup after tests
  after(() => {
    if (originalAdminSecret !== undefined) {
      process.env.ADMIN_SECRET = originalAdminSecret;
    } else {
      delete process.env.ADMIN_SECRET;
    }
  });

  test('Valid admin login returns 200 success', async () => {
    process.env.ADMIN_SECRET = 'correct_secret';

    const mockRequest = {
      json: async () => ({ password: 'correct_secret' })
    };

    const response = await POST(mockRequest);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { success: true });
  });

  test('Invalid admin login returns 401', async () => {
    process.env.ADMIN_SECRET = 'correct_secret';

    const mockRequest = {
      json: async () => ({ password: 'wrong_password' })
    };

    const response = await POST(mockRequest);

    assert.strictEqual(response.status, 401);
    assert.deepStrictEqual(response.body, { error: "Invalid password" });
  });

  test('Missing ADMIN_SECRET environment variable returns 500 error', async () => {
    delete process.env.ADMIN_SECRET;

    const mockRequest = {
      json: async () => ({ password: 'any_password' })
    };

    const response = await POST(mockRequest);

    assert.strictEqual(response.status, 500);
    assert.deepStrictEqual(response.body, { error: "Server configuration error" });
  });

  test('Malformed request JSON returns 400 invalid request', async () => {
    process.env.ADMIN_SECRET = 'correct_secret';

    const mockRequest = {
      json: async () => { throw new Error('Invalid JSON'); }
    };

    const response = await POST(mockRequest);

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, { error: "Invalid request" });
  });
});
