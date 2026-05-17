import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { formatBRL, getFreteCentavos, getRegiaoLabel } from "@/lib/shipping";
import { createOrder } from "@/lib/orders.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — As Cidadelas 360º" }] }),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const createOrderFn = useServerFn(createOrder);

  const [destinatario, setDestinatario] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Faça login para finalizar a compra");
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user?.user_metadata?.nome && !destinatario) {
      setDestinatario(String(user.user_metadata.nome));
    }
  }, [user, destinatario]);

  const buscarCep = async (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) { toast.error("CEP não encontrado"); return; }
      setLogradouro(data.logradouro ?? "");
      setBairro(data.bairro ?? "");
      setCidade(data.localidade ?? "");
      setUf(data.uf ?? "");
    } catch { toast.error("Erro ao buscar CEP"); }
    finally { setCepLoading(false); }
  };

  const frete = uf ? getFreteCentavos(uf) : 0;
  const total = subtotal + frete;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Carrinho vazio"); return; }
    setSubmitting(true);
    try {
      const result = await createOrderFn({
        data: {
          endereco: {
            destinatario, cep, logradouro, numero,
            complemento: complemento || null,
            bairro, cidade, uf: uf.toUpperCase(),
          },
          items: items.map((i) => ({
            slug: i.slug, tamanho: i.tamanho ?? null, variante: i.variante ?? null, quantidade: i.quantidade,
          })),
        },
      });
      clear();
      toast.success("Pedido criado!");
      navigate({ to: "/pedido/sucesso", search: { id: result.orderId } });
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
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-display text-4xl font-medium text-foreground">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Endereço de entrega</h2>

            <Field label="Destinatário"><input required value={destinatario} onChange={(e) => setDestinatario(e.target.value)} maxLength={120} className={inputCls} /></Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="CEP">
                <div className="relative">
                  <input required value={cep} onChange={(e) => setCep(e.target.value)} onBlur={(e) => buscarCep(e.target.value)} maxLength={9} placeholder="00000-000" className={inputCls} />
                  {cepLoading && <span className="absolute right-3 top-2 text-xs text-muted-foreground">...</span>}
                </div>
              </Field>
              <Field label="UF"><input required value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} maxLength={2} className={inputCls} /></Field>
            </div>

            <Field label="Logradouro"><input required value={logradouro} onChange={(e) => setLogradouro(e.target.value)} maxLength={200} className={inputCls} /></Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Número"><input required value={numero} onChange={(e) => setNumero(e.target.value)} maxLength={20} className={inputCls} /></Field>
              <Field label="Complemento"><input value={complemento} onChange={(e) => setComplemento(e.target.value)} maxLength={120} className={inputCls} /></Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Bairro"><input required value={bairro} onChange={(e) => setBairro(e.target.value)} maxLength={120} className={inputCls} /></Field>
              <Field label="Cidade"><input required value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength={120} className={inputCls} /></Field>
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-6">
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
              <div className="flex justify-between">
                <span>Frete {uf && `(${getRegiaoLabel(uf)})`}</span>
                <span>{uf ? formatBRL(frete) : "—"}</span>
              </div>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span><span className="text-primary">{formatBRL(total)}</span>
            </div>
            <button type="submit" disabled={submitting || !uf}
              className="mt-4 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {submitting ? "Criando pedido..." : "Confirmar pedido"}
            </button>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              O pagamento (cartão / PIX / boleto) será integrado em seguida via Stripe.
            </p>
          </aside>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}

const inputCls = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
