import { mock, test } from 'node:test';
import * as assert from 'node:assert';

test('Upload API', async (t) => {
  await t.test('returns 400 if no file uploaded', async () => {
    const { POST } = await import(`../../../app/api/upload/route.js?t=${Date.now()}`);

    const formData = new FormData();

    const request = new Request('http://localhost', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    assert.strictEqual(response.status, 400);
    const data = await response.json();
    assert.strictEqual(data.error, 'No file uploaded');
  });

  await t.test('returns 200 on successful upload', async () => {
    mock.module('fs/promises', {
      namedExports: {
        writeFile: async () => {},
        mkdir: async () => {}
      }
    });

    // Using dynamic import with cache busting since it's ES modules and the mock might not apply if it was already imported
    const { POST } = await import(`../../../app/api/upload/route.js?t=${Date.now()}`);

    const formData = new FormData();
    formData.append('image', new Blob(['test content']), 'test.jpg');

    const request = new Request('http://localhost', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.match(data.url, /^\/uploads\/.*\.jpg$/);

    mock.restoreAll();
  });

  await t.test('returns 500 if upload fails', async () => {
    mock.module('fs/promises', {
      namedExports: {
        writeFile: async () => { throw new Error('Mock write error'); },
        mkdir: async () => {}
      }
    });

    const { POST } = await import(`../../../app/api/upload/route.js?t=${Date.now()}`);

    const formData = new FormData();
    formData.append('image', new Blob(['test content']), 'test.jpg');

    const request = new Request('http://localhost', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    assert.strictEqual(response.status, 500);
    const data = await response.json();
    assert.strictEqual(data.error, 'Upload failed');

    mock.restoreAll();
  });
});
