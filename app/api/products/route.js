// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('activeOnly') === 'true';
  const products = await prisma.product.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request) {
  try {
    // Authentication check
    const adminSession = request.cookies.get("admin_session")?.value;
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || adminSession !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}