import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

export type ProductDTO = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  preco_centavos: number;
  imagem_url: string;
  badge: string | null;
  tamanhos: string[];
  variantes: string[];
};

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id, slug, nome, descricao, categoria, preco_centavos, imagem_url, badge, tamanhos, variantes")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProductDTO[];
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, nome, descricao, categoria, preco_centavos, imagem_url, badge, tamanhos, variantes")
      .eq("slug", data.slug)
      .eq("ativo", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as ProductDTO | null;
  });
