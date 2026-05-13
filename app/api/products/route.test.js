import test from 'node:test';
import assert from 'node:assert';
import { mock } from 'node:test';

// Mock the global prisma instance
const mockPrisma = {
  product: {
    create: mock.fn(),
    findMany: mock.fn(),
  }
};

mock.module('@/lib/prisma.js', {
  namedExports: {
    prisma: mockPrisma
  }
});

// Mock next/server to return simple objects instead of Response objects which have streams as body
mock.module('next/server', {
  namedExports: {
    NextResponse: {
      json: (body, init) => {
        return {
          body,
          status: init?.status || 200,
          json: async () => body
        };
      }
    }
  }
});

// Import the module after mocking
const { POST, GET } = await import('./route.js');

test('POST /api/products creates a product successfully', async () => {
  const newProductData = {
    name: 'Test Product',
    price: 100,
    category: 'Test Category',
    colors: 'red,blue',
    icon: 'test-icon'
  };

  const createdProduct = { id: 'test-id', ...newProductData };

  mockPrisma.product.create.mock.mockImplementationOnce(() => Promise.resolve(createdProduct));

  const fakeRequest = {
    json: async () => newProductData
  };

  const response = await POST(fakeRequest);

  assert.strictEqual(response.status, 201);
  assert.deepStrictEqual(await response.json(), createdProduct);

  const createCalls = mockPrisma.product.create.mock.calls;
  assert.strictEqual(createCalls.length, 1);
  assert.deepStrictEqual(createCalls[0].arguments[0], { data: newProductData });
});

test('POST /api/products handles errors gracefully', async () => {
  const errorMessage = 'Database error';
  mockPrisma.product.create.mock.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

  const fakeRequest = {
    json: async () => ({ name: 'Failing Product' })
  };

  const response = await POST(fakeRequest);

  assert.strictEqual(response.status, 500);
  assert.deepStrictEqual(await response.json(), { error: errorMessage });
});

test('GET /api/products retrieves all products', async () => {
  const mockProducts = [{ id: '1', name: 'Product 1' }];
  mockPrisma.product.findMany.mock.mockImplementationOnce(() => Promise.resolve(mockProducts));

  const fakeRequest = {
    url: 'http://localhost/api/products'
  };

  const response = await GET(fakeRequest);

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(await response.json(), mockProducts);

  const findManyCalls = mockPrisma.product.findMany.mock.calls;
  assert.strictEqual(findManyCalls.length, 1);
  assert.deepStrictEqual(findManyCalls[0].arguments[0], {
    where: {},
    orderBy: { createdAt: "desc" }
  });
});

test('GET /api/products retrieves active only products when query param is set', async () => {
  const mockProducts = [{ id: '1', name: 'Product 1' }];
  mockPrisma.product.findMany.mock.mockImplementationOnce(() => Promise.resolve(mockProducts));

  const fakeRequest = {
    url: 'http://localhost/api/products?activeOnly=true'
  };

  const response = await GET(fakeRequest);

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(await response.json(), mockProducts);

  const findManyCalls = mockPrisma.product.findMany.mock.calls;
  const lastCallIndex = findManyCalls.length - 1;
  assert.deepStrictEqual(findManyCalls[lastCallIndex].arguments[0], {
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });
});
