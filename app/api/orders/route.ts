import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseImages,
  GIFT_FEE_MAD,
  candleSubtotalWithBundle,
  deliveryFeeFor,
} from "@/lib/format";
import { sendOrderNotificationEmail } from "@/lib/email";

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
    isGift?: boolean;
    giftMessage?: string;
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
  let candleQty = 0;
  let candleRegularMAD = 0;
  let otherSubtotalMAD = 0;
  for (const it of b.items) {
    const p = products.find((x) => x.id === it.productId);
    const qty = Math.max(1, Math.floor(Number(it.qty) || 0));
    if (!p) {
      return NextResponse.json(
        { error: "One of the products is no longer available." },
        { status: 409 },
      );
    }
    const lineTotal = p.priceMAD * qty;
    if ((p.category || "CANDLE").toUpperCase() === "CANDLE") {
      candleQty += qty;
      candleRegularMAD += lineTotal;
    } else {
      otherSubtotalMAD += lineTotal;
    }
    lineItems.push({
      productId: p.id,
      name: p.name,
      unitPriceMAD: p.priceMAD,
      qty,
      image: parseImages(p.images)[0] ?? null,
    });
  }

  // Bundle pricing and delivery are authoritative here — recomputed from the
  // server-side catalogue, never trusted from the client.
  const { subtotalMAD: candleSubtotal } = candleSubtotalWithBundle(
    candleQty,
    candleRegularMAD,
  );
  const subtotal = candleSubtotal + otherSubtotalMAD;
  const isGift = b.isGift === true;
  const giftFee = isGift ? GIFT_FEE_MAD : 0;
  const delivery = deliveryFeeFor(candleQty);
  const total = subtotal + delivery + giftFee;

  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber(),
      customerName: b.customerName.trim(),
      phone: b.phone.trim(),
      email: b.email?.trim() || null,
      city: b.city.trim(),
      address: b.address.trim(),
      notes: b.notes?.trim() || null,
      isGift,
      giftMessage: isGift ? b.giftMessage?.trim().slice(0, 300) || null : null,
      giftFeeMAD: giftFee,
      subtotalMAD: subtotal,
      deliveryMAD: delivery,
      totalMAD: total,
      status: "NEW",
      items: { create: lineItems },
    },
  });

  // Fire-and-forget owner notification. Never let an email failure break checkout.
  void sendOrderNotificationEmail({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    city: order.city,
    address: order.address,
    notes: order.notes,
    isGift: order.isGift,
    giftMessage: order.giftMessage,
    giftFeeMAD: order.giftFeeMAD,
    subtotalMAD: order.subtotalMAD,
    deliveryMAD: order.deliveryMAD,
    totalMAD: order.totalMAD,
    bundleSavingsMAD: Math.max(0, candleRegularMAD - candleSubtotal),
    items: lineItems.map((li) => ({
      name: li.name,
      qty: li.qty,
      unitPriceMAD: li.unitPriceMAD,
    })),
  });

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
    subtotalMAD: order.subtotalMAD,
    deliveryMAD: order.deliveryMAD,
    giftFeeMAD: order.giftFeeMAD,
    totalMAD: order.totalMAD,
  });
}
