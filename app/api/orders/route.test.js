import { describe, it } from 'node:test';
import assert from 'node:assert';
import { POST } from './route.js';

describe('Orders API POST', () => {
  it('should return 500 when request.json() throws an error', async () => {
    const mockRequest = {
      json: async () => {
        throw new Error('Test JSON error');
      }
    };

    const response = await POST(mockRequest);

    assert.strictEqual(response.status, 500);

    const data = await response.json();
    assert.strictEqual(data.error, 'Test JSON error');
  });
});
