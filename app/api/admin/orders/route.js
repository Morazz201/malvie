import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true },   // ✅ include customer relation
      orderBy: { createdAt: "desc" },
    });

    // Safely parse items JSON (handle potential errors)
    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      items: (() => {
        try {
          return JSON.parse(order.items);
        } catch {
          return []; // fallback empty array if parsing fails
        }
      })(),
    }));

    return NextResponse.json(ordersWithParsedItems);
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PUT /api/admin/orders error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}