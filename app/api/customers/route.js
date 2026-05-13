import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: true },
      orderBy: { createdAt: "desc" },
    });
    // Add order count
    const customersWithCount = customers.map(c => ({
      ...c,
      orderCount: c.orders.length,
    }));
    return NextResponse.json(customersWithCount);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}