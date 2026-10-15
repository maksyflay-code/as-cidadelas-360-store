import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/lib/auth";
import { useServerFn } from "@tanstack/react-start";
import { listMyOrders } from "@/lib/orders.functions";
import { formatBRL } from "@/lib/shipping";
import { downloadEbook, refreshPayment } from "@/lib/payments.functions";
import { canDownload } from "@/lib/payment-rules";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/conta")({
  component: ContaPage,
  head: () => ({ meta: [
    { title: "Meus e-books e pedidos — As Cidadelas 360º" },
    { name: "description", content: "Acompanhe seus pagamentos e baixe os e-books adquiridos." },
    { property: "og:title", content: "Meus e-books e pedidos — As Cidadelas 360º" },
    { property: "og:description", content: "Acompanhe seus pagamentos e baixe os e-books adquiridos." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
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
  const [orders, setOrders] = useState<Array<{
    id: string; status: string; payment_provider: string | null; payment_id: string | null;
    total_centavos: number; created_at: string;
    order_items: Array<{ id: string; product_id: string | null; nome_snapshot: string }>;
  }>>([]);
  const download = useServerFn(downloadEbook);
  const refresh = useServerFn(refreshPayment);
  const [busy, setBusy] = useState<string | null>(null);
  const handleRefresh = async (id: string) => {
    setBusy(id);
    try { await refresh({ data: { id } }); setOrders(await list()); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível consultar o pagamento."); }
    finally { setBusy(null); }
  };
  const handleDownload = async (orderId: string, productId: string, format: "pdf" | "epub") => {
    setBusy(orderId);
    try { const result = await download({ data: { orderId, productId, format } }); window.location.assign(result.url); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível baixar o e-book."); }
    finally { setBusy(null); }
  };
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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-display text-4xl font-medium text-foreground">Minha conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>Sair</Button>
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
                  <ul className="mt-4 space-y-3 border-t border-border pt-4">
                    {o.order_items.map(item => (
                      <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>{item.nome_snapshot}</span>
                        {canDownload(o) && item.product_id && <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled={busy === o.id} onClick={() => item.product_id && handleDownload(o.id, item.product_id, "pdf")}><Download /> PDF</Button>
                        </div>}
                      </li>
                    ))}
                  </ul>
                  {o.payment_provider === "mercado_pago" && <Button className="mt-3" variant="ghost" size="sm" disabled={busy === o.id} onClick={() => handleRefresh(o.id)}><RefreshCw /> Atualizar pagamento</Button>}
                </li>
              ))}
            </ul>
          )}
      </section>
      <SiteFooter />
    </div>
  );
}
