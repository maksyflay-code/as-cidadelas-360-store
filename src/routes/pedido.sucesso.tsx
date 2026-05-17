import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckCircle2 } from "lucide-react";

const searchSchema = z.object({ id: z.string().uuid().optional() });

export const Route = createFileRoute("/pedido/sucesso")({
  validateSearch: searchSchema,
  component: SucessoPage,
  head: () => ({ meta: [{ title: "Pedido confirmado — As Cidadelas 360º" }] }),
});

function SucessoPage() {
  const { id } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-display text-4xl font-medium text-foreground">Pedido recebido!</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Seu pedido foi registrado com sucesso. Em breve você receberá instruções de pagamento.
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
