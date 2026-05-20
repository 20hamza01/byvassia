import { Resend } from "resend";
import { formatDH } from "@/lib/format";

type OrderItemForEmail = {
  name: string;
  qty: number;
  unitPriceMAD: number;
};

type OrderForEmail = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  notes: string | null;
  isGift: boolean;
  giftMessage: string | null;
  giftFeeMAD: number;
  subtotalMAD: number;
  deliveryMAD: number;
  totalMAD: number;
  bundleSavingsMAD: number;
  items: OrderItemForEmail[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml(o: OrderForEmail): string {
  const rows = o.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(it.name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatDH(it.unitPriceMAD)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatDH(it.unitPriceMAD * it.qty)}</td>
      </tr>`,
    )
    .join("");

  const savingsRow =
    o.bundleSavingsMAD > 0
      ? `<tr><td colspan="3" style="padding:6px 12px;text-align:right;color:#a8451e;">Bundle savings</td>
       <td style="padding:6px 12px;text-align:right;color:#a8451e;">− ${formatDH(o.bundleSavingsMAD)}</td></tr>`
      : "";

  const deliveryRow = `<tr><td colspan="3" style="padding:6px 12px;text-align:right;color:#555;">Delivery</td>
       <td style="padding:6px 12px;text-align:right;">${o.deliveryMAD === 0 ? "FREE" : formatDH(o.deliveryMAD)}</td></tr>`;

  const giftRow = o.isGift
    ? `<tr><td colspan="3" style="padding:6px 12px;text-align:right;color:#555;">Gift wrapping</td>
       <td style="padding:6px 12px;text-align:right;">${formatDH(o.giftFeeMAD)}</td></tr>`
    : "";

  const giftMessageBlock =
    o.isGift && o.giftMessage
      ? `<p style="margin:0 0 8px 0;"><strong>Gift message:</strong><br/>${escapeHtml(o.giftMessage)}</p>`
      : "";

  const notesBlock = o.notes
    ? `<p style="margin:0 0 8px 0;"><strong>Notes:</strong><br/>${escapeHtml(o.notes)}</p>`
    : "";

  const customerEmail = o.email
    ? `<p style="margin:0 0 4px 0;"><strong>Email:</strong> ${escapeHtml(o.email)}</p>`
    : "";

  return `<!doctype html>
<html><body style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;background:#fafaf7;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;padding:24px;border:1px solid #ece8df;">
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:22px;margin:0 0 4px 0;">New order — ${escapeHtml(o.orderNumber)}</h1>
    <p style="margin:0 0 20px 0;color:#666;font-size:13px;letter-spacing:1px;text-transform:uppercase;">VASSIA Candles &amp; Scents</p>

    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#666;margin:0 0 8px 0;">Customer</h2>
    <p style="margin:0 0 4px 0;"><strong>${escapeHtml(o.customerName)}</strong></p>
    <p style="margin:0 0 4px 0;"><strong>Phone:</strong> ${escapeHtml(o.phone)}</p>
    ${customerEmail}
    <p style="margin:0 0 4px 0;"><strong>City:</strong> ${escapeHtml(o.city)}</p>
    <p style="margin:0 0 16px 0;"><strong>Address:</strong> ${escapeHtml(o.address)}</p>

    ${notesBlock}
    ${giftMessageBlock}

    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#666;margin:20px 0 8px 0;">Items</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f6f3ec;">
          <th style="padding:8px 12px;text-align:left;">Product</th>
          <th style="padding:8px 12px;text-align:center;">Qty</th>
          <th style="padding:8px 12px;text-align:right;">Unit</th>
          <th style="padding:8px 12px;text-align:right;">Line</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        ${savingsRow}
        <tr><td colspan="3" style="padding:6px 12px;text-align:right;color:#555;">Subtotal</td>
            <td style="padding:6px 12px;text-align:right;">${formatDH(o.subtotalMAD)}</td></tr>
        ${deliveryRow}
        ${giftRow}
        <tr><td colspan="3" style="padding:10px 12px;text-align:right;font-weight:bold;border-top:1px solid #ddd;">Total</td>
            <td style="padding:10px 12px;text-align:right;font-weight:bold;border-top:1px solid #ddd;">${formatDH(o.totalMAD)}</td></tr>
      </tbody>
    </table>

    <p style="margin:24px 0 0 0;font-size:12px;color:#888;">Payment: Cash on Delivery — confirm with the customer on WhatsApp.</p>
  </div>
</body></html>`;
}

function renderText(o: OrderForEmail): string {
  const lines: string[] = [];
  lines.push(`New order — ${o.orderNumber}`);
  lines.push("");
  lines.push(`Customer: ${o.customerName}`);
  lines.push(`Phone:    ${o.phone}`);
  if (o.email) lines.push(`Email:    ${o.email}`);
  lines.push(`City:     ${o.city}`);
  lines.push(`Address:  ${o.address}`);
  if (o.notes) lines.push(`Notes:    ${o.notes}`);
  if (o.isGift) {
    lines.push(`Gift:     yes${o.giftMessage ? ` — "${o.giftMessage}"` : ""}`);
  }
  lines.push("");
  lines.push("Items:");
  for (const it of o.items) {
    lines.push(
      `  ${it.qty} × ${it.name} — ${formatDH(it.unitPriceMAD)} (line ${formatDH(it.unitPriceMAD * it.qty)})`,
    );
  }
  lines.push("");
  if (o.bundleSavingsMAD > 0) {
    lines.push(`Bundle savings: − ${formatDH(o.bundleSavingsMAD)}`);
  }
  lines.push(`Subtotal: ${formatDH(o.subtotalMAD)}`);
  lines.push(
    `Delivery: ${o.deliveryMAD === 0 ? "FREE" : formatDH(o.deliveryMAD)}`,
  );
  if (o.isGift) lines.push(`Gift fee: ${formatDH(o.giftFeeMAD)}`);
  lines.push(`Total:    ${formatDH(o.totalMAD)}`);
  return lines.join("\n");
}

/**
 * Send an order-received notification to the shop owner.
 * Fails silently (returns false) if Resend is not configured or the API
 * call errors — order creation must never fail because email broke.
 */
export async function sendOrderNotificationEmail(
  order: OrderForEmail,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  // Resend requires a verified domain to send "from"; until one is set up,
  // fall back to Resend's test sender, which only delivers to the account owner's address.
  const from = process.env.ORDER_NOTIFICATION_FROM || "VASSIA Orders <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      `[orders] Skipping notification email for ${order.orderNumber} — missing env: ` +
        `${!apiKey ? "RESEND_API_KEY " : ""}${!to ? "ORDER_NOTIFICATION_EMAIL" : ""}`,
    );
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `New order ${order.orderNumber} — ${formatDH(order.totalMAD)}`,
      html: renderHtml(order),
      text: renderText(order),
      replyTo: order.email || undefined,
    });
    if (error) {
      // Log full error object so Vercel logs surface name + message (e.g.
      // "validation_error: You can only send testing emails to your own email
      // address" when using onboarding@resend.dev to a non-owner address).
      console.error(
        `[orders] Resend failed for ${order.orderNumber} ` +
          `(from=${from} to=${to}):`,
        JSON.stringify(error),
      );
      return false;
    }
    console.info(
      `[orders] Notification email sent for ${order.orderNumber} (id=${data?.id})`,
    );
    return true;
  } catch (err) {
    console.error(
      `[orders] Exception sending notification for ${order.orderNumber}:`,
      err,
    );
    return false;
  }
}
