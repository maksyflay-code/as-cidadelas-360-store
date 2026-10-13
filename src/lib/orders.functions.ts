import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { EBOOK_SLUGS } from "./catalog";
import { PurchaseSchema } from "./payment-rules";

const ItemSchema = z.object({
  slug: z.string().min(1).max(80),
  tamanho: z.string().max(20).optional().nullable(),
  variante: z.string().max(40).optional().nullable(),
  quantidade: z.number().int().min(1).max(50),
});

const CreateOrderSchema = z.object({
  items: z.array(ItemSchema).min(1).max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PurchaseSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { mercadoPago, SITE_URL, WEBHOOK_PATH } = await import("./mercado-pago.server");

    // Buscar produtos reais para validar preço (não confiar no cliente)
    const slugs = data.items.map((i) => i.slug);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id, slug, nome, preco_centavos, categoria")
      .in("slug", slugs)
      .eq("ativo", true);
    if (pErr) throw new Error(pErr.message);

    const bySlug = new Map((products ?? []).map((p) => [p.slug, p]));

    let subtotal = 0;
    const itemsInsert = data.items.map((it) => {
      const p = bySlug.get(it.slug);
      if (!p) throw new Error(`Produto não encontrado: ${it.slug}`);
      if (p.categoria !== "E-book" || !EBOOK_SLUGS.has(p.slug)) throw new Error("Este produto não está mais disponível");
      subtotal += p.preco_centavos * it.quantidade;
      return {
        product_id: p.id,
        nome_snapshot: p.nome,
        tamanho: null,
        variante: null,
        quantidade: it.quantidade,
        preco_unit_centavos: p.preco_centavos,
      };
    });

    // Never accept payment for an ebook whose downloadable file is missing.
    for (const slug of new Set(slugs)) {
      const { data: files, error } = await supabaseAdmin.storage.from("ebooks").list("", { search: slug, limit: 20 });
      if (error || !files?.some(file => file.name === `${slug}.pdf` || file.name === `${slug}.epub`)) {
        throw new Error("Este e-book ainda está sendo preparado para entrega. Nenhuma cobrança foi realizada.");
      }
    }
    if (!process.env['MERCADO_PAGO_WEBHOOK_SECRET']) throw new Error("A confirmação automática do pagamento ainda está sendo configurada. Nenhuma cobrança foi realizada.");
    const frete = 0;
    const total = subtotal;

    // Prices and items were validated above; only the server may insert orders.
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        subtotal_centavos: subtotal,
        frete_centavos: frete,
        total_centavos: total,
        endereco: { tipo: "digital" },
        payment_provider: "mercado_pago",
      })
      .select("id")
      .single();
    if (oErr) throw new Error(oErr.message);

    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(itemsInsert.map((i) => ({ ...i, order_id: order.id })));
    if (iErr) throw new Error(iErr.message);

    try {
      const preference = await mercadoPago("/checkout/preferences", {
        method: "POST",
        body: JSON.stringify({
          external_reference: order.id,
          items: itemsInsert.map(item => ({ id: item.product_id, title: item.nome_snapshot, quantity: item.quantidade, unit_price: item.preco_unit_centavos / 100, currency_id: "BRL" })),
          back_urls: {
            success: `${SITE_URL}/pedido/sucesso?id=${order.id}`,
            pending: `${SITE_URL}/pedido/sucesso?id=${order.id}`,
            failure: `${SITE_URL}/pedido/sucesso?id=${order.id}`,
          },
          auto_return: "approved",
          notification_url: `${SITE_URL}${WEBHOOK_PATH}`,
        }),
      });
      const validated = z.object({ id: z.string(), init_point: z.string().url(), sandbox_init_point: z.string().url().optional() }).parse(preference);
      const checkoutUrl = process.env['MERCADO_PAGO_ACCESS_TOKEN']?.startsWith("TEST-") ? validated.sandbox_init_point ?? validated.init_point : validated.init_point;
      const parsedUrl = new URL(checkoutUrl);
      if (parsedUrl.protocol !== "https:" || !(parsedUrl.hostname === "mercadopago.com.br" || parsedUrl.hostname.endsWith(".mercadopago.com.br"))) throw new Error("Endereço de pagamento inválido.");
      const { error } = await supabaseAdmin.from("orders").update({ payment_preference_id: validated.id }).eq("id", order.id);
      if (error) throw new Error("Não foi possível preparar o pagamento.");
      return { orderId: order.id, checkoutUrl };
    } catch (error) {
      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      throw error;
    }
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, payment_provider, payment_id, subtotal_centavos, frete_centavos, total_centavos, endereco, created_at, order_items(id, product_id, nome_snapshot)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, subtotal_centavos, frete_centavos, total_centavos, endereco, created_at, order_items(id, nome_snapshot, tamanho, variante, quantidade, preco_unit_centavos)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order;
  });
