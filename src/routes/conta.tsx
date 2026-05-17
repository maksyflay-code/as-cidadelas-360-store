import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/lib/auth";
import { useServerFn } from "@tanstack/react-start";
import { listMyOrders } from "@/lib/orders.functions";
import { formatBRL } from "@/lib/shipping";

export const Route = createFileRoute("/conta")({
  component: ContaPage,
  head: () => ({ meta: [{ title: "Minha conta — As Cidadelas 360º" }] }),
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  failed: "Pagamento falhou",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
};

function ContaPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const list = useServerFn(listMyOrders);
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    list().then((d) => { setOrders(d ?? []); setFetching(false); }).catch(() => setFetching(false));
  }, [user, list]);

  if (loading || !user) return <div className="min-h-screen bg-background"><SiteHeader /><div className="p-12 text-center">Carregando...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-display text-4xl font-medium text-foreground">Minha conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="rounded-md border border-border px-4 py-2 text-sm">Sair</button>
        </div>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-foreground">Meus pedidos</h2>

        {fetching ? <p className="mt-4 text-sm text-muted-foreground">Carregando pedidos...</p>
          : orders.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">Você ainda não tem pedidos.</p>
              <Link to="/loja" className="mt-3 inline-block text-primary underline">Ver a loja</Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                      <p className="mt-1 text-sm text-foreground">{STATUS_LABEL[o.status] ?? o.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{formatBRL(o.total_centavos)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </section>
      <SiteFooter />
    </div>
  );
}
