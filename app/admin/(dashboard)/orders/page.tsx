import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDH, ORDER_STATUSES } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where =
    status && ORDER_STATUSES.includes(status as never) ? { status } : {};
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <p className="eyebrow">Orders</p>
      <h1 className="mt-4 font-display text-5xl font-light">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </h1>

      <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-b border-line pb-5">
        <Link
          href="/admin/orders"
          className="text-xs uppercase tracking-[0.18em]"
          style={{ color: !status ? "var(--color-ink)" : "var(--color-taupe)" }}
        >
          All
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className="text-xs uppercase tracking-[0.18em]"
            style={{
              color: status === s ? "var(--color-ink)" : "var(--color-taupe)",
            }}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        {orders.length === 0 ? (
          <p className="p-12 text-center text-taupe">No orders here.</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-[0.16em] text-taupe">
                <th className="p-4 font-normal">Order</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">City</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
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
                  <td className="p-4 text-taupe">
                    {o.createdAt.toLocaleDateString("fr-MA")}
                  </td>
                  <td className="p-4">
                    {o.customerName}
                    <span className="block text-xs text-taupe">{o.phone}</span>
                  </td>
                  <td className="p-4 text-taupe">{o.city}</td>
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
