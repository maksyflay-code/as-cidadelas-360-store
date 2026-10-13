import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrder } from "@/lib/orders.functions";
import { refreshPayment } from "@/lib/payments.functions";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

const searchSchema = z.object({ id: z.string().uuid().optional() });

export const Route = createFileRoute("/pedido/sucesso")({
  validateSearch: searchSchema,
  component: SucessoPage,
  head: () => ({ meta: [
    { title: "Status do pagamento — As Cidadelas 360º" },
    { name: "description", content: "Confira a confirmação do pagamento e o acesso aos seus e-books." },
    { property: "og:title", content: "Status do pagamento — As Cidadelas 360º" },
    { property: "og:description", content: "Confira a confirmação do pagamento e o acesso aos seus e-books." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
});

function SucessoPage() {
  const { id } = Route.useSearch();
  const { user } = useAuth();
  const { clear } = useCart();
  const refresh = useServerFn(refreshPayment);
  const getOrder = useServerFn(getMyOrder);
  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => {
    if (!user || !id) return;
    let active = true;
    const check = async () => {
      try {
        await refresh({ data: { id } });
        const order = await getOrder({ data: { id } });
        if (active) { setStatus(order?.status ?? null); if (order?.status === "paid") clear(); }
      } catch { if (active) setStatus("unverified"); }
    };
    void check();
    const timer = setInterval(check, 10000);
    return () => { active = false; clearInterval(timer); };
  }, [user, id, refresh, getOrder]);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        {status === "paid" && <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />}
        <h1 className="mt-6 text-display text-4xl font-medium text-foreground">{status === "paid" ? "Pagamento aprovado!" : status === "failed" || status === "canceled" ? "Pagamento não concluído" : "Confirmação do pagamento"}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {status === "paid" ? "Seus e-books estão disponíveis em Minha conta." : !user ? "Entre na sua conta para consultar o pagamento." : "Consulte Minha conta para acompanhar o pagamento. Os arquivos só serão liberados após a aprovação."}
        </p>
        {id && <p className="mt-4 font-mono text-xs text-muted-foreground">Nº: {id}</p>}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/conta" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Meus pedidos</Link>
          <Link to="/loja" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium">Continuar comprando</Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
