import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDH, parseImages } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Products</p>
          <h1 className="mt-4 font-display text-5xl font-light">
            {products.length} product{products.length === 1 ? "" : "s"}
          </h1>
        </div>
        <Link href="/admin/products/new" className="btn">
          New product
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto border border-line">
        {products.length === 0 ? (
          <p className="p-12 text-center text-taupe">
            No products. Create your first one.
          </p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-[0.16em] text-taupe">
                <th className="p-4 font-normal">Product</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal">Price</th>
                <th className="p-4 font-normal">Stock</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = parseImages(p.images)[0];
                return (
                  <tr
                    key={p.id}
                    className="border-b border-line/60 last:border-0 hover:bg-ivory-2"
                  >
                    <td className="p-4">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex items-center gap-4"
                      >
                        <span className="relative h-14 w-12 shrink-0 overflow-hidden bg-ivory-2">
                          {img && (
                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span className="link-underline font-display text-lg">
                          {p.name}
                        </span>
                        {p.featured && (
                          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                            Signature
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="p-4 text-taupe">{p.category}</td>
                    <td className="p-4">{formatDH(p.priceMAD)}</td>
                    <td className="p-4 text-taupe">{p.stock}</td>
                    <td className="p-4">
                      <span
                        className="text-xs uppercase tracking-[0.16em]"
                        style={{
                          color:
                            p.status === "ACTIVE"
                              ? "var(--color-ink)"
                              : "var(--color-taupe)",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
