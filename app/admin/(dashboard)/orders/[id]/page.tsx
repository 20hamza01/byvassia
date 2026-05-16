import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDH } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-xs uppercase tracking-[0.2em] text-taupe hover:text-ink"
      >
        ← Orders
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="mt-3 font-display text-4xl font-light">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-taupe">
            Placed {order.createdAt.toLocaleString("fr-MA")}
          </p>
        </div>
        <span className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.18em]">
          {order.status}
        </span>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-[0.16em] text-taupe">
                <th className="p-4 font-normal">Item</th>
                <th className="p-4 font-normal">Unit</th>
                <th className="p-4 font-normal">Qty</th>
                <th className="p-4 text-right font-normal">Line</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-b border-line/60 last:border-0">
                  <td className="p-4">{it.name}</td>
                  <td className="p-4 text-taupe">
                    {formatDH(it.unitPriceMAD)}
                  </td>
                  <td className="p-4">{it.qty}</td>
                  <td className="p-4 text-right">
                    {formatDH(it.unitPriceMAD * it.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line">
                <td colSpan={3} className="p-4 text-taupe">
                  Total
                </td>
                <td className="p-4 text-right font-display text-xl">
                  {formatDH(order.totalMAD)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-10">
          <div className="border border-line p-7">
            <p className="eyebrow">Customer</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-taupe">Name</dt>
                <dd>{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-taupe">Phone</dt>
                <dd>
                  <a href={`tel:${order.phone}`} className="link-underline">
                    {order.phone}
                  </a>
                </dd>
              </div>
              {order.email && (
                <div>
                  <dt className="text-taupe">Email</dt>
                  <dd>{order.email}</dd>
                </div>
              )}
              <div>
                <dt className="text-taupe">City</dt>
                <dd>{order.city}</dd>
              </div>
              <div>
                <dt className="text-taupe">Address</dt>
                <dd className="whitespace-pre-wrap">{order.address}</dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-taupe">Notes</dt>
                  <dd className="whitespace-pre-wrap">{order.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border border-line p-7">
            <OrderStatusSelect orderId={order.id} current={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
