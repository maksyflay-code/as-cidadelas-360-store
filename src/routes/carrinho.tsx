import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";
import { getProductImage } from "@/lib/productImages";
import { formatBRL } from "@/lib/shipping";
import { Trash2, Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/carrinho")({
  component: CarrinhoPage,
  head: () => ({ meta: [{ title: "Carrinho — As Cidadelas 360º" }] }),
});

function CarrinhoPage() {
  const { items, updateQty, remove, subtotal } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-display text-4xl font-medium text-foreground">Carrinho</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Link to="/loja" className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
              Explorar a loja
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={`${it.slug}-${it.tamanho}-${it.variante}`} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <img src={getProductImage(it.slug)} alt={it.nome} className="h-24 w-24 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col">
                    <p className="font-medium text-foreground">{it.nome}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {it.tamanho && `Tam: ${it.tamanho}`}{it.tamanho && it.variante && " · "}{it.variante}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button onClick={() => updateQty(it.slug, it.quantidade - 1, it.tamanho, it.variante)} className="px-2 py-1">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{it.quantidade}</span>
                        <button onClick={() => updateQty(it.slug, it.quantidade + 1, it.tamanho, it.variante)} className="px-2 py-1">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-semibold text-primary">{formatBRL(it.preco_centavos * it.quantidade)}</p>
                    </div>
                  </div>
                  <button onClick={() => remove(it.slug, it.tamanho, it.variante)} aria-label="Remover"
                    className="self-start text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resumo</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatBRL(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Frete calculado no checkout.</p>
              <Link to="/checkout"
                className="mt-6 block rounded-md bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Finalizar compra
              </Link>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
