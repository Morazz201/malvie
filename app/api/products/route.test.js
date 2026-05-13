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
