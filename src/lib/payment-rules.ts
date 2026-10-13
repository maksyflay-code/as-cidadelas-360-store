import { z } from "zod";

export const PurchaseSchema = z.object({
  items: z.array(z.object({ slug: z.string().min(1).max(80), quantidade: z.number().int().min(1).max(50) })).min(1).max(50),
});

export type VerifiedPayment = {
  id: number | string;
  status: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
};

export function paymentMatchesOrder(payment: VerifiedPayment, order: { id: string; total_centavos: number }) {
  return payment.external_reference === order.id && payment.currency_id === "BRL"
    && Math.round(payment.transaction_amount * 100) === order.total_centavos;
}

export function canDownload(order: { status: string; payment_provider: string | null; payment_id: string | null }) {
  return order.status === "paid" && order.payment_provider === "mercado_pago" && Boolean(order.payment_id);
}

export const DOWNLOAD_SECONDS = 300;