import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toDTO } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id } });
  if (!row) notFound();
  return <ProductForm product={toDTO(row)} />;
}
