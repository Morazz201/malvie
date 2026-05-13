import { test, mock } from 'node:test';
import assert from 'node:assert';

// Mock Next.js NextResponse
mock.module('next/server', {
  namedExports: {
    NextResponse: {
      json: (body, init) => ({ body, init })
    }
  }
});

// Create mock functions for Prisma
const findUniqueMock = mock.fn();
const createCustomerMock = mock.fn();
const updateCustomerMock = mock.fn();
const createOrderMock = mock.fn();

const prismaMock = {
  customer: {
    findUnique: findUniqueMock,
    create: createCustomerMock,
    update: updateCustomerMock
  },
  order: {
    create: createOrderMock
  }
};

mock.module('@/lib/prisma', {
  namedExports: {
    prisma: prismaMock
  }
});

// Mock Resend Email client
const sendMock = mock.fn(async () => {});
mock.module('resend', {
  namedExports: {
    Resend: class Resend {
      constructor(apiKey) {
        this.apiKey = apiKey;
        this.emails = { send: sendMock };
      }
    }
  }
});

test('Order Creation API Tests', async (t) => {
  const { POST } = await import('../app/api/orders/route.js');

  const defaultMockRequest = {
    json: async () => ({
      customer: { email: 'test@example.com', fullName: 'Test', phone: '123', address: '123 Test St', city: 'Testville', postalCode: '12345' },
      cart: [{ id: 'prod-1', name: 'Product 1', price: 100, quantity: 1 }],
      totals: { subtotal: 100, shipping: 10, tax: 0, total: 110 },
      paymentMethod: 'CASH',
    })
  };

  await t.test('POST /api/orders creates a new customer and order when customer does not exist', async () => {
    // Reset call counts properly
    findUniqueMock.mock.resetCalls();
    createCustomerMock.mock.resetCalls();
    updateCustomerMock.mock.resetCalls();
    createOrderMock.mock.resetCalls();
    sendMock.mock.resetCalls();

    findUniqueMock.mock.mockImplementation(async () => null);
    createCustomerMock.mock.mockImplementation(async () => ({ id: 'new-cust-1' }));
    createOrderMock.mock.mockImplementation(async () => ({ id: 'new-order-1' }));

    const response = await POST(defaultMockRequest);

    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.orderId, 'new-order-1');
    assert.strictEqual(response.init.status, 201);

    // Verification
    assert.strictEqual(findUniqueMock.mock.callCount(), 1);
    assert.strictEqual(createCustomerMock.mock.callCount(), 1);
    assert.strictEqual(updateCustomerMock.mock.callCount(), 0);
    assert.strictEqual(createOrderMock.mock.callCount(), 1);
    assert.strictEqual(sendMock.mock.callCount(), 2, 'Should send two emails: customer and admin');
  });

  await t.test('POST /api/orders updates existing customer and creates order when customer exists', async () => {
    // Reset call counts properly
    findUniqueMock.mock.resetCalls();
    createCustomerMock.mock.resetCalls();
    updateCustomerMock.mock.resetCalls();
    createOrderMock.mock.resetCalls();
    sendMock.mock.resetCalls();

    // Setup mocks
    findUniqueMock.mock.mockImplementation(async () => ({ id: 'existing-cust-1' }));
    updateCustomerMock.mock.mockImplementation(async () => ({ id: 'existing-cust-1' }));
    createOrderMock.mock.mockImplementation(async () => ({ id: 'new-order-2' }));

    const response = await POST(defaultMockRequest);

    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.orderId, 'new-order-2');

    // Verification
    assert.strictEqual(findUniqueMock.mock.callCount(), 1);
    assert.strictEqual(createCustomerMock.mock.callCount(), 0, 'Should not create new customer');
    assert.strictEqual(updateCustomerMock.mock.callCount(), 1, 'Should update existing customer');
    assert.strictEqual(createOrderMock.mock.callCount(), 1);
  });

  await t.test('POST /api/orders returns 500 error if DB fails', async () => {
    // Setup error mock
    findUniqueMock.mock.mockImplementation(async () => {
      throw new Error('Database connection failed');
    });

    const response = await POST(defaultMockRequest);

    assert.strictEqual(response.body.error, 'Database connection failed');
    assert.strictEqual(response.init.status, 500);
  });
});
