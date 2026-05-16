import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDH, ORDER_STATUSES } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [orders, products, recent] = await Promise.all([
    prisma.order.findMany({ select: { status: true, totalMAD: true } }),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
  ]);

  const revenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((s, o) => s + o.totalMAD, 0);
  const open = orders.filter(
    (o) => o.status === "NEW" || o.status === "CONFIRMED",
  ).length;
  const byStatus = Object.fromEntries(
    ORDER_STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length]),
  );

  const stats = [
    { label: "Open orders", value: open },
    { label: "Total orders", value: orders.length },
    { label: "Products", value: products },
    { label: "Revenue (delivered)", value: formatDH(revenue) },
  ];

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="mt-4 font-display text-5xl font-light">Atelier</h1>

      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-ivory p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-taupe">
              {s.label}
            </p>
            <p className="mt-5 font-display text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => (
          <span
            key={s}
            className="border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-taupe"
          >
            {s} · {byStatus[s]}
          </span>
        ))}
      </div>

      <div className="mt-14 flex items-end justify-between">
        <h2 className="font-display text-2xl">Recent orders</h2>
        <Link
          href="/admin/orders"
          className="text-xs uppercase tracking-[0.2em] text-taupe hover:text-ink"
        >
          All orders →
        </Link>
      </div>

      <div className="mt-6 overflow-hidden border border-line">
        {recent.length === 0 ? (
          <p className="p-10 text-center text-taupe">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-[0.16em] text-taupe">
                <th className="p-4 font-normal">Order</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Items</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-line/60 last:border-0 hover:bg-ivory-2"
                >
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="link-underline"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4 text-taupe">
                    {o.items.reduce((n, i) => n + i.qty, 0)}
                  </td>
                  <td className="p-4">{formatDH(o.totalMAD)}</td>
                  <td className="p-4">
                    <span className="text-xs uppercase tracking-[0.16em]">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
