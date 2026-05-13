import { test, mock } from 'node:test';
import assert from 'node:assert';
import { POST } from './route.js';
import { prisma } from '@/lib/prisma.js';

test('POST handles errors correctly', async () => {
  // Use manual mocking since prisma uses dynamic getters that mock.method doesn't support well
  const originalCreate = prisma.product.create;

  prisma.product.create = async () => {
    throw new Error('Database connection failed');
  };

  try {
    // Create a mock request object
    const mockRequest = {
      json: async () => ({ name: 'Test Product', price: 100 })
    };

    // Call the POST function
    const response = await POST(mockRequest);

    // Assert the response properties using the mocked NextResponse we created in loader
    // The previous loader setup provided a Next.js server stub where NextResponse.json returns { body, init }

    // Check if the response is a standard Web Response (Next.js 13+) or our mock
    if (response.status !== undefined) {
      assert.strictEqual(response.status, 500);
      const json = await response.json();
      assert.deepStrictEqual(json, { error: 'Database connection failed' });
    } else {
      assert.strictEqual(response.init.status, 500);
      assert.deepStrictEqual(response.body, { error: 'Database connection failed' });
    }
  } finally {
    // Restore the original function
    prisma.product.create = originalCreate;
  }
});
