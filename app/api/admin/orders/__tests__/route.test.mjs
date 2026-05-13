import assert from "node:assert";
import { test, mock } from "node:test";

const prismaMock = {
  order: {
    update: mock.fn(async () => ({ id: 1, status: "SHIPPED" })),
  }
};

mock.module("file://" + process.cwd() + "/lib/prisma.js", {
  namedExports: {
    prisma: prismaMock
  }
});

mock.module("next/server", {
  namedExports: {
    NextResponse: {
      json: (body, init) => {
        return {
          body,
          status: init?.status ?? 200,
          headers: init?.headers ?? {},
          json: async () => body
        };
      }
    }
  }
});

const { PUT } = await import("../route.js");

test("PUT update order - success", async () => {
  const req = {
    json: async () => ({ orderId: 1, status: "SHIPPED" })
  };
  const res = await PUT(req);
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).status, "SHIPPED");

  assert.strictEqual(prismaMock.order.update.mock.calls.length, 1);
  assert.deepStrictEqual(prismaMock.order.update.mock.calls[0].arguments[0], {
    where: { id: 1 },
    data: { status: "SHIPPED" }
  });
});

test("PUT update order - error", async () => {
  const req = {
    json: async () => { throw new Error("Invalid json") }
  };
  const res = await PUT(req);
  assert.strictEqual(res.status, 500);
  assert.strictEqual((await res.json()).error, "Failed to update order");
});
