import test from 'node:test';
import assert from 'node:assert';

test('GET admin orders - success with JSON parsing', async () => {
    const { GET } = await import('./route.js');
    const { prisma } = await import('@/lib/prisma');

    const originalFindMany = prisma.order.findMany;
    let findManyArgs = null;
    prisma.order.findMany = async (args) => {
        findManyArgs = args;
        return [
            { id: 1, items: '[{"id": 101, "name": "Item 1"}]', customer: { name: "John" } },
            { id: 2, items: 'invalid json', customer: null },
            { id: 3, items: null, customer: { name: "Doe" } }
        ];
    };

    try {
        const response = await GET();
        const responseData = response.data;

        assert.deepStrictEqual(findManyArgs, {
            include: { customer: true },
            orderBy: { createdAt: "desc" }
        });

        assert.strictEqual(responseData.length, 3);
        assert.deepStrictEqual(responseData[0].items, [{ id: 101, name: "Item 1" }]);
        assert.deepStrictEqual(responseData[1].items, []);
        assert.strictEqual(responseData[2].items, null);
    } finally {
        prisma.order.findMany = originalFindMany;
    }
});

test('GET admin orders - database error', async () => {
    const { GET } = await import('./route.js');
    const { prisma } = await import('@/lib/prisma');

    const originalFindMany = prisma.order.findMany;
    prisma.order.findMany = async () => {
        throw new Error("Database connection failed");
    };

    const originalConsoleError = console.error;
    let consoleErrorOutput = null;
    console.error = (msg, err) => {
        consoleErrorOutput = msg;
    };

    try {
        const response = await GET();
        const responseData = response.data;

        assert.strictEqual(response.init.status, 500);
        assert.deepStrictEqual(responseData, { error: "Failed to fetch orders" });
        assert.strictEqual(consoleErrorOutput, "GET /api/admin/orders error:");
    } finally {
        prisma.order.findMany = originalFindMany;
        console.error = originalConsoleError;
    }
});

test('PUT admin orders', async () => {
    const { PUT } = await import('./route.js');
    const { prisma } = await import('@/lib/prisma');

    const originalUpdate = prisma.order.update;
    let updateArgs = null;
    prisma.order.update = async (args) => {
        updateArgs = args;
        return { id: args.where.id, status: args.data.status };
    };

    try {
        const requestMock = {
            json: async () => ({ orderId: "ord_123", status: "SHIPPED" })
        };

        const response = await PUT(requestMock);
        const responseData = response.data;

        assert.deepStrictEqual(updateArgs, {
            where: { id: "ord_123" },
            data: { status: "SHIPPED" }
        });

        assert.strictEqual(response.init.status, 200);
        assert.deepStrictEqual(responseData, { id: "ord_123", status: "SHIPPED" });
    } finally {
        prisma.order.update = originalUpdate;
    }
});

test('PUT admin orders - error', async () => {
    const { PUT } = await import('./route.js');
    const { prisma } = await import('@/lib/prisma');

    const originalUpdate = prisma.order.update;
    prisma.order.update = async () => {
        throw new Error("Update failed");
    };

    const originalConsoleError = console.error;
    let consoleErrorOutput = null;
    console.error = (msg, err) => {
        consoleErrorOutput = msg;
    };

    try {
        const requestMock = {
            json: async () => ({ orderId: "ord_123", status: "SHIPPED" })
        };

        const response = await PUT(requestMock);
        const responseData = response.data;

        assert.strictEqual(response.init.status, 500);
        assert.deepStrictEqual(responseData, { error: "Failed to update order" });
        assert.strictEqual(consoleErrorOutput, "PUT /api/admin/orders error:");
    } finally {
        prisma.order.update = originalUpdate;
        console.error = originalConsoleError;
    }
});
