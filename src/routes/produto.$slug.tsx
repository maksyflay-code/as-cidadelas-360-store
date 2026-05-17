import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProductBySlug } from "@/lib/products.functions";
import { getProductImage } from "@/lib/productImages";
import { formatBRL } from "@/lib/shipping";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug({ data: { slug: params.slug } });
    if (!product) throw notFound();
    return { product };
  },
  component: ProdutoPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-display text-3xl">Produto não encontrado</h1>
        <Link to="/loja" className="mt-4 inline-block text-primary underline">Ver loja</Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-display text-3xl">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
      <SiteFooter />
    </div>
  ),
});

function ProdutoPage() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const { add } = useCart();
  const [tamanho, setTamanho] = useState<string>(product.tamanhos[0] ?? "");
  const [variante, setVariante] = useState<string>(product.variantes[0] ?? "");
  const [qty, setQty] = useState(1);

  const handleAdd = (goToCart: boolean) => {
    if (product.tamanhos.length > 0 && !tamanho) { toast.error("Escolha um tamanho"); return; }
    add({
      slug: product.slug,
      nome: product.nome,
      preco_centavos: product.preco_centavos,
      imagem_url: product.imagem_url,
      tamanho: tamanho || undefined,
      variante: variante || undefined,
      quantidade: qty,
    });
    toast.success("Adicionado ao carrinho");
    if (goToCart) navigate({ to: "/carrinho" });
  };

  const img = getProductImage(product.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-card">
          <img src={img} alt={product.nome} className="h-full w-full object-cover" />
        </div>

        <div>
          {product.badge && (
            <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold">
              {product.badge}
            </span>
          )}
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">{product.categoria}</p>
          <h1 className="mt-2 text-display text-4xl font-medium text-foreground md:text-5xl">{product.nome}</h1>
          <p className="mt-4 text-3xl font-semibold text-primary">{formatBRL(product.preco_centavos)}</p>

          {product.descricao && (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.descricao}</p>
          )}

          {product.tamanhos.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Tamanho</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tamanhos.map((t: string) => (
                  <button key={t} onClick={() => setTamanho(t)}
                    className={`min-w-12 rounded-md border px-4 py-2 text-sm font-medium transition ${
                      tamanho === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variantes.length > 1 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Variante</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variantes.map((v: string) => (
                  <button key={v} onClick={() => setVariante(v)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                      variante === v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(50, q + 1))} className="px-3 py-2"><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => handleAdd(false)}
              className="flex-1 rounded-md border border-primary py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
              Adicionar ao carrinho
            </button>
            <button onClick={() => handleAdd(true)}
              className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Comprar agora
            </button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
