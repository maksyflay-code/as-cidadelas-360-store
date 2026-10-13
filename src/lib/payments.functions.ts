import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { DOWNLOAD_SECONDS, canDownload } from "./payment-rules";

const OrderId = z.object({ id: z.string().uuid() });

export const refreshPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => OrderId.parse(input))
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase.from("orders")
      .select("id, payment_provider").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
    if (error || !order) throw new Error("Pedido não encontrado.");
    if (order.payment_provider !== "mercado_pago") return { checked: false };
    const { mercadoPago, reconcilePayment } = await import("./mercado-pago.server");
    const response = await mercadoPago(`/v1/payments/search?external_reference=${encodeURIComponent(order.id)}&sort=date_created&criteria=desc&limit=10`);
    for (const payment of response.results ?? []) {
      if (await reconcilePayment(payment, order.id)) break;
    }
    return { checked: true };
  });

export const downloadEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid(), productId: z.string().uuid(), format: z.enum(["pdf", "epub"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("orders")
      .select("status, payment_provider, payment_id").eq("id", data.orderId).eq("user_id", context.userId).maybeSingle();
    if (!order || !canDownload(order)) throw new Error("O download será liberado após a aprovação do pagamento.");
    const { data: item } = await context.supabase.from("order_items")
      .select("product_id").eq("order_id", data.orderId).eq("product_id", data.productId).limit(1).maybeSingle();
    if (!item) throw new Error("Este e-book não pertence ao seu pedido.");
    const { data: product } = await context.supabase.from("products").select("slug").eq("id", data.productId).maybeSingle();
    if (!product) throw new Error("E-book não encontrado.");
    const { data: signed, error } = await context.supabase.storage.from("ebooks")
      .createSignedUrl(`${product.slug}.${data.format}`, DOWNLOAD_SECONDS, { download: true });
    if (error || !signed) throw new Error("Arquivo ainda indisponível. Entre em contato com a loja.");
    const browserUrl = import.meta.env.VITE_SUPABASE_URL;
    const signedUrl = new URL(signed.signedUrl);
    const baseUrl = new URL(browserUrl);
    return { url: `${baseUrl.origin}${baseUrl.pathname.replace(/\/$/, "")}${signedUrl.pathname}${signedUrl.search}` };
  });