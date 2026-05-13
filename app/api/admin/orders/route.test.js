import test from "node:test";
import assert from "node:assert";
import { prisma } from "@/lib/prisma";
import { PUT } from "./route.js";

test("PUT /api/admin/orders error handling test", async (t) => {
  const originalUpdate = prisma.order?.update;

  if (!prisma.order) {
    prisma.order = {};
  }
  prisma.order.update = async () => {
    throw new Error("Simulated database error");
  };

  const request = {
    json: async () => ({ orderId: "123", status: "completed" })
  };

  const response = await PUT(request);
  assert.strictEqual(response.status, 500);

  if (originalUpdate) {
    prisma.order.update = originalUpdate;
  }
});
