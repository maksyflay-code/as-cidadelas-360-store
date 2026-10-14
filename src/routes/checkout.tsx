import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { formatBRL } from "@/lib/shipping";
import { createOrder } from "@/lib/orders.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [
    { title: "Pagamento — As Cidadelas 360º" },
    { name: "description", content: "Revise seus e-books e pague pelo Mercado Pago." },
    { property: "og:title", content: "Pagamento — As Cidadelas 360º" },
    { property: "og:description", content: "Revise seus e-books e pague pelo Mercado Pago." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const { user, loading: authLoading } = useAuth();
  const createOrderFn = useServerFn(createOrder);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Faça login para finalizar a compra");
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const total = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Carrinho vazio"); return; }
    setSubmitting(true);
    try {
      const result = await createOrderFn({
        data: {
          items: items.map((i) => ({
            slug: i.slug, tamanho: i.tamanho ?? null, variante: i.variante ?? null, quantidade: i.quantidade,
          })),
        },
      });
      window.location.assign(result.checkoutUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar pedido");
    } finally { setSubmitting(false); }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background"><SiteHeader /><div className="p-12 text-center text-muted-foreground">Carregando...</div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-xl p-12 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Link to="/loja" className="mt-4 inline-block text-primary underline">Voltar à loja</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-display text-4xl font-medium text-foreground">Checkout</h1>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
          <div className="mb-6 border-l-2 border-gold pl-5">
            <h2 className="text-display text-2xl font-medium text-foreground">Entrega digital</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Não é necessário informar endereço ou CEP. Os e-books adquiridos ficam disponíveis
              em Minha conta após a aprovação do pagamento.
            </p>
          </div>

          <aside className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resumo</h2>
            <ul className="space-y-2 text-sm">
              {items.map((i) => (
                <li key={`${i.slug}-${i.tamanho}-${i.variante}`} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{i.nome} ×{i.quantidade}</span>
                  <span>{formatBRL(i.preco_centavos * i.quantidade)}</span>
                </li>
              ))}
            </ul>
            <hr className="border-border" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
              <div className="flex justify-between"><span>Entrega digital</span><span>Grátis</span></div>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span><span className="text-primary">{formatBRL(total)}</span>
            </div>
            <Button type="submit" disabled={submitting} size="lg" className="mt-4 w-full">
              {submitting ? "Preparando pagamento..." : "Pagar com Mercado Pago"}
            </Button>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Pix e cartão, conforme as opções disponíveis no Mercado Pago.
            </p>
          </aside>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}

