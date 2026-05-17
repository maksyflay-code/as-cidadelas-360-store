import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { getFreteCentavos } from "./shipping";

const EnderecoSchema = z.object({
  destinatario: z.string().min(1).max(120),
  cep: z.string().min(8).max(10),
  logradouro: z.string().min(1).max(200),
  numero: z.string().min(1).max(20),
  complemento: z.string().max(120).optional().nullable(),
  bairro: z.string().min(1).max(120),
  cidade: z.string().min(1).max(120),
  uf: z.string().length(2),
});

const ItemSchema = z.object({
  slug: z.string().min(1).max(80),
  tamanho: z.string().max(20).optional().nullable(),
  variante: z.string().max(40).optional().nullable(),
  quantidade: z.number().int().min(1).max(50),
});

const CreateOrderSchema = z.object({
  endereco: EnderecoSchema,
  items: z.array(ItemSchema).min(1).max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateOrderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Buscar produtos reais para validar preço (não confiar no cliente)
    const slugs = data.items.map((i) => i.slug);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id, slug, nome, preco_centavos")
      .in("slug", slugs)
      .eq("ativo", true);
    if (pErr) throw new Error(pErr.message);

    const bySlug = new Map((products ?? []).map((p) => [p.slug, p]));

    let subtotal = 0;
    const itemsInsert = data.items.map((it) => {
      const p = bySlug.get(it.slug);
      if (!p) throw new Error(`Produto não encontrado: ${it.slug}`);
      subtotal += p.preco_centavos * it.quantidade;
      return {
        product_id: p.id,
        nome_snapshot: p.nome,
        tamanho: it.tamanho ?? null,
        variante: it.variante ?? null,
        quantidade: it.quantidade,
        preco_unit_centavos: p.preco_centavos,
      };
    });

    const frete = getFreteCentavos(data.endereco.uf);
    const total = subtotal + frete;

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        subtotal_centavos: subtotal,
        frete_centavos: frete,
        total_centavos: total,
        endereco: data.endereco,
      })
      .select("id")
      .single();
    if (oErr) throw new Error(oErr.message);

    const { error: iErr } = await supabase
      .from("order_items")
      .insert(itemsInsert.map((i) => ({ ...i, order_id: order.id })));
    if (iErr) throw new Error(iErr.message);

    return { orderId: order.id, total_centavos: total, frete_centavos: frete, subtotal_centavos: subtotal };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, subtotal_centavos, frete_centavos, total_centavos, endereco, created_at")
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
