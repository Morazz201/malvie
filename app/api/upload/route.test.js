import test from 'node:test';
import assert from 'node:assert';
import { POST } from './route.js';
import * as fsPromises from 'fs/promises';
import os from 'os';
import path from 'path';

test('upload route tests', async (t) => {
  const originalCwd = process.cwd;
  const tmpDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'malvie-test-'));

  t.after(async () => {
    process.cwd = originalCwd;
    await fsPromises.rm(tmpDir, { recursive: true, force: true });
  });

  await t.test('returns 400 if no file uploaded', async () => {
    const request = {
      formData: async () => ({
        get: (name) => null
      })
    };
    const response = await POST(request);
    assert.strictEqual(response.status, 400);
    const body = await response.json();
    assert.deepStrictEqual(body, { error: 'No file uploaded' });
  });

  await t.test('returns 500 if error occurs', async () => {
    const originalConsoleError = console.error;
    console.error = () => {};

    const request = {
      formData: async () => { throw new Error('Test error'); }
    };
    const response = await POST(request);
    assert.strictEqual(response.status, 500);
    const body = await response.json();
    assert.deepStrictEqual(body, { error: 'Upload failed' });

    console.error = originalConsoleError;
  });

  await t.test('returns 200 and url if upload succeeds', async () => {
    process.cwd = () => tmpDir;

    const file = {
      name: 'test.jpg',
      arrayBuffer: async () => new ArrayBuffer(8)
    };
    const request = {
      formData: async () => ({
        get: (name) => name === 'image' ? file : null
      })
    };
    const response = await POST(request);
    assert.strictEqual(response.status, 200);
    const body = await response.json();
    assert.ok(body.url);
    assert.match(body.url, /^\/uploads\/[a-f0-9-]+\.jpg$/);

    const filename = body.url.split('/').pop();
    const stat = await fsPromises.stat(path.join(tmpDir, 'public/uploads', filename));
    assert.ok(stat.isFile());
  });
});
