import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case "week": startDate.setDate(now.getDate() - 7); break;
      case "month": startDate.setMonth(now.getMonth() - 1); break;
      case "quarter": startDate.setMonth(now.getMonth() - 3); break;
      default: startDate.setMonth(now.getMonth() - 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: "CANCELLED" },
      },
      include: { customer: true },
    });

    if (orders.length === 0) {
      return NextResponse.json({
        period,
        dateRange: { from: startDate.toISOString(), to: now.toISOString() },
        summary: { totalRevenue: 0, totalOrders: 0, uniqueCustomers: 0 },
        topProducts: [],
        categoryBreakdown: [],
        customerGeo: { topCities: [], countries: [] },
      });
    }

    const productSales = new Map();
    for (const order of orders) {
      let items;
      try {
        items = JSON.parse(order.items);
      } catch {
        continue;
      }
      for (const item of items) {
        const existing = productSales.get(item.name) || { quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        productSales.set(item.name, existing);
      }
    }
    const topProducts = Array.from(productSales.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const allProducts = await prisma.product.findMany({
      select: { name: true, category: true },
    });
    const productCategoryMap = Object.fromEntries(allProducts.map(p => [p.name, p.category]));
    const categorySales = new Map();
    for (const [productName, data] of productSales) {
      const category = productCategoryMap[productName] || "uncategorized";
      const existing = categorySales.get(category) || { revenue: 0, quantity: 0 };
      existing.revenue += data.revenue;
      existing.quantity += data.quantity;
      categorySales.set(category, existing);
    }
    const categoryBreakdown = Array.from(categorySales.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    const [cityAggregates, countryAggregates] = await Promise.all([
      prisma.customer.groupBy({
        by: ["city"],
        where: {
          city: { notIn: ["", null] },
        },
        _count: {
          city: true,
        },
        orderBy: {
          _count: {
            city: "desc",
          },
        },
        take: 10,
      }),
      prisma.customer.groupBy({
        by: ["country"],
        where: {
          country: { notIn: ["", null] },
        },
        _count: {
          country: true,
        },
      }),
    ]);

    const topCities = cityAggregates.map((agg) => ({
      city: agg.city,
      count: agg._count.city,
    }));

    const countries = countryAggregates.map((agg) => ({
      country: agg.country,
      count: agg._count.country,
    }));

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.customerId)).size;

    return NextResponse.json({
      period,
      dateRange: { from: startDate.toISOString(), to: now.toISOString() },
      summary: { totalRevenue, totalOrders, uniqueCustomers },
      topProducts,
      categoryBreakdown,
      customerGeo: { topCities, countries },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to load analytics", details: error.message },
      { status: 500 }
    );
  }
}