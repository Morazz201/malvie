import test from "node:test";
import assert from "node:assert";

import { POST } from "../../../app/api/upload/route.js";

test("Upload API POST - missing image returns 400", async () => {
  const request = {
    formData: async () => {
      const fd = new Map();
      return {
        get: (key) => fd.get(key) || null
      };
    }
  };

  const response = await POST(request);

  assert.strictEqual(response.status, 400);

  const data = await response.json();
  assert.strictEqual(data.error, "No file uploaded");
});

test("Upload API POST - no formData returns 500 error", async () => {
  const request = {
    formData: async () => {
      throw new Error("Invalid FormData");
    }
  };

  const response = await POST(request);

  assert.strictEqual(response.status, 500);

  const data = await response.json();
  assert.strictEqual(data.error, "Upload failed");
});
