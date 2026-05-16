import { prisma } from "./prisma";
import { parseImages } from "./format";
import type { ProductDTO } from "./types";

type Row = {
  id: string;
  slug: string;
  name: string;
  description: string;
  scentNotes: string;
  priceMAD: number;
  category: string;
  images: string;
  stock: number;
  status: string;
  featured: boolean;
  weightG: number | null;
  burnTime: string | null;
};

export function toDTO(p: Row): ProductDTO {
  return { ...p, images: parseImages(p.images) };
}

export async function getActiveProducts(category?: string) {
  const rows = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(category && category !== "ALL" ? { category } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toDTO);
}

export async function getFeatured(limit = 3) {
  const rows = await prisma.product.findMany({
    where: { status: "ACTIVE", featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toDTO);
}

export async function getProductBySlug(slug: string) {
  const p = await prisma.product.findUnique({ where: { slug } });
  return p ? toDTO(p) : null;
}

export async function getRelated(slug: string, category: string, limit = 3) {
  const rows = await prisma.product.findMany({
    where: { status: "ACTIVE", category, slug: { not: slug } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toDTO);
}
