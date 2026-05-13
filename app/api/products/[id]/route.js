import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

// In Next.js 15+, `params` is a Promise – we must await it before using its properties
export async function GET(request, { params }) {
  try {
    const { id } = await params;                 // ✅ await the Promise
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Authentication check
    const adminSession = request.cookies.get("admin_session")?.value;
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || adminSession !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;                 // ✅ await the Promise
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Authentication check
    const adminSession = request.cookies.get("admin_session")?.value;
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || adminSession !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;                 // ✅ await the Promise
    // Optional: log for debugging (now safe because id is resolved)
    console.log("DELETE called for id:", id);

    const product = await prisma.product.findUnique({ where: { id } });
    if (product?.image) {
      const imagePath = path.join(process.cwd(), "public", product.image);
      try {
        await unlink(imagePath);
      } catch (err) {
        // ignore if file doesn't exist
      }
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}