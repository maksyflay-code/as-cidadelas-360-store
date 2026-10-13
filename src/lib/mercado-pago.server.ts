import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { paymentMatchesOrder } from "./payment-rules";

export const SITE_URL = "https://www.ascidadelasdaesperanca360.com.br";
export const WEBHOOK_PATH = "/api/public/mercado-pago/webhook";

export async function mercadoPago(path: string, init: RequestInit = {}) {
  const token = process.env['MERCADO_PAGO_ACCESS_TOKEN'];
  if (!token) throw new Error("O pagamento ainda não está configurado.");
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    ...init, headers: { "Content-Type": "application/json", ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    // Provider responses can contain buyer data; never log the raw body or credentials.
    console.error("Mercado Pago request failed", { status: response.status });
    throw new Error(`Mercado Pago indisponível (${response.status}). Tente novamente mais tarde.`);
  }
  return response.json();
}

const PaymentSchema = z.object({
  id: z.union([z.string().max(80), z.number()]), status: z.string().max(40),
  external_reference: z.string().uuid().nullable(), transaction_amount: z.number().nonnegative(), currency_id: z.string().max(3),
});

export async function reconcilePayment(raw: unknown, expectedOrderId?: string) {
  const payment = PaymentSchema.parse(raw);
  if (!payment.external_reference || (expectedOrderId && expectedOrderId !== payment.external_reference)) return false;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order, error } = await supabaseAdmin.from("orders")
    .select("id, total_centavos, status, payment_provider, payment_id").eq("id", payment.external_reference).maybeSingle();
  if (error) throw new Error("Não foi possível verificar o pedido.");
  if (!order || order.payment_provider !== "mercado_pago" || !paymentMatchesOrder(payment, order)) return false;
  // Do not let a separate failed attempt undo an approved payment.
  if (order.payment_id && order.payment_id !== String(payment.id)) return false;
  const status = payment.status === "approved" ? "paid"
    : ["refunded", "cancelled", "charged_back"].includes(payment.status) ? "canceled"
    : payment.status === "rejected" ? "failed" : null;
  if (!status || (order.status === "paid" && status === "failed")) return false;
  const { error: updateError } = await supabaseAdmin.from("orders")
    .update({ status, payment_id: String(payment.id) }).eq("id", order.id);
  if (updateError) throw new Error("Não foi possível atualizar o pagamento.");
  return true;
}

export function verifyWebhookSignature(request: Request, secret: string) {
  const id = new URL(request.url).searchParams.get("data.id");
  const requestId = request.headers.get("x-request-id");
  const parts = Object.fromEntries((request.headers.get("x-signature") ?? "").split(",").map(p => p.trim().split("=")));
  const ts = parts['ts'];
  const signature = parts['v1'];
  if (!id || !requestId || !ts || !signature || !/^\d+$/.test(ts) || !/^[a-fA-F0-9]{64}$/.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(`id:${id.toLowerCase()};request-id:${requestId};ts:${ts};`).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}