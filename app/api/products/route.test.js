import { GET, POST } from "./route.js";
import { prisma } from "@/lib/prisma";

// Mock prisma and NextResponse
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => {
      // Simulate Response.json behavior by wrapping data and passing through status
      return {
        async json() { return data; },
        status: options?.status || 200,
        ok: (options?.status || 200) < 400
      };
    }),
  },
}));

describe("Products API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns all products when activeOnly is false", async () => {
      const mockProducts = [{ id: 1, name: "Product 1" }];
      prisma.product.findMany.mockResolvedValue(mockProducts);

      const request = { url: "http://localhost/api/products" };
      const response = await GET(request);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
      });

      const data = await response.json();
      expect(data).toEqual(mockProducts);
    });

    it("returns active products when activeOnly is true", async () => {
      const mockProducts = [{ id: 1, name: "Product 1", isActive: true }];
      prisma.product.findMany.mockResolvedValue(mockProducts);

      const request = { url: "http://localhost/api/products?activeOnly=true" };
      const response = await GET(request);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });

      const data = await response.json();
      expect(data).toEqual(mockProducts);
    });
  });

  describe("POST", () => {
    it("creates a new product successfully", async () => {
      const newProduct = { name: "New Product", price: 100 };
      const createdProduct = { id: 2, ...newProduct };

      prisma.product.create.mockResolvedValue(createdProduct);

      const request = {
        json: jest.fn().mockResolvedValue(newProduct),
      };

      const response = await POST(request);

      expect(prisma.product.create).toHaveBeenCalledWith({ data: newProduct });
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toEqual(createdProduct);
    });

    it("handles creation errors", async () => {
      const errorMessage = "Database error";
      prisma.product.create.mockRejectedValue(new Error(errorMessage));

      const request = {
        json: jest.fn().mockResolvedValue({ name: "Bad Product" }),
      };

      const response = await POST(request);

      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data).toEqual({ error: errorMessage });
    });
  });
});
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
