import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const name = String(b.name ?? "").trim();
  if (!name)
    return NextResponse.json({ error: "Name is required." }, { status: 400 });

  let slug = b.slug ? slugify(String(b.slug)) : slugify(name);
  // Guarantee uniqueness.
  const base = slug || "product";
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      description: String(b.description ?? ""),
      scentNotes: String(b.scentNotes ?? ""),
      priceMAD: Math.max(0, Math.round(Number(b.priceMAD) || 0)),
      category: ["CANDLE", "DIFFUSER", "ACCESSORY"].includes(b.category)
        ? b.category
        : "CANDLE",
      images: JSON.stringify(
        Array.isArray(b.images) ? b.images.filter(Boolean) : [],
      ),
      stock: Math.max(0, Math.round(Number(b.stock) || 0)),
      status: b.status === "DRAFT" ? "DRAFT" : "ACTIVE",
      featured: Boolean(b.featured),
      weightG: b.weightG ? Math.round(Number(b.weightG)) : null,
      burnTime: b.burnTime ? String(b.burnTime) : null,
    },
  });

  return NextResponse.json({ ok: true, product });
}
