import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const b = await req.json();
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = existing.slug;
  if (b.slug && slugify(b.slug) !== existing.slug) {
    slug = slugify(b.slug);
    let i = 1;
    const base = slug;
    while (
      await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      slug = `${base}-${i++}`;
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      slug,
      name: b.name !== undefined ? String(b.name).trim() : existing.name,
      description:
        b.description !== undefined
          ? String(b.description)
          : existing.description,
      scentNotes:
        b.scentNotes !== undefined
          ? String(b.scentNotes)
          : existing.scentNotes,
      priceMAD:
        b.priceMAD !== undefined
          ? Math.max(0, Math.round(Number(b.priceMAD) || 0))
          : existing.priceMAD,
      category:
        b.category && ["CANDLE", "DIFFUSER", "ACCESSORY"].includes(b.category)
          ? b.category
          : existing.category,
      images:
        b.images !== undefined
          ? JSON.stringify(
              Array.isArray(b.images) ? b.images.filter(Boolean) : [],
            )
          : existing.images,
      stock:
        b.stock !== undefined
          ? Math.max(0, Math.round(Number(b.stock) || 0))
          : existing.stock,
      status:
        b.status !== undefined
          ? b.status === "DRAFT"
            ? "DRAFT"
            : "ACTIVE"
          : existing.status,
      featured:
        b.featured !== undefined ? Boolean(b.featured) : existing.featured,
      weightG:
        b.weightG !== undefined
          ? b.weightG
            ? Math.round(Number(b.weightG))
            : null
          : existing.weightG,
      burnTime:
        b.burnTime !== undefined
          ? b.burnTime
            ? String(b.burnTime)
            : null
          : existing.burnTime,
    },
  });

  return NextResponse.json({ ok: true, product });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
