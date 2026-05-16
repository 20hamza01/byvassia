import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/format";

function orderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VA-${ymd}-${rnd}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = body as {
    customerName?: string;
    phone?: string;
    email?: string;
    city?: string;
    address?: string;
    notes?: string;
    items?: { productId: string; qty: number }[];
  };

  if (
    !b.customerName ||
    !b.phone ||
    !b.city ||
    !b.address ||
    !Array.isArray(b.items) ||
    b.items.length === 0
  ) {
    return NextResponse.json(
      { error: "Please fill in your name, phone, city, address and add items." },
      { status: 400 },
    );
  }

  // Recompute everything from the database — never trust client prices.
  const ids = b.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
  });

  const lineItems = [];
  let subtotal = 0;
  for (const it of b.items) {
    const p = products.find((x) => x.id === it.productId);
    const qty = Math.max(1, Math.floor(Number(it.qty) || 0));
    if (!p) {
      return NextResponse.json(
        { error: "One of the products is no longer available." },
        { status: 409 },
      );
    }
    subtotal += p.priceMAD * qty;
    lineItems.push({
      productId: p.id,
      name: p.name,
      unitPriceMAD: p.priceMAD,
      qty,
      image: parseImages(p.images)[0] ?? null,
    });
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber(),
      customerName: b.customerName.trim(),
      phone: b.phone.trim(),
      email: b.email?.trim() || null,
      city: b.city.trim(),
      address: b.address.trim(),
      notes: b.notes?.trim() || null,
      subtotalMAD: subtotal,
      deliveryMAD: 0,
      totalMAD: subtotal,
      status: "NEW",
      items: { create: lineItems },
    },
  });

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
    totalMAD: order.totalMAD,
  });
}
