import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Heart, Globe, Sparkles } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () => ({
    meta: [
      { title: "Sobre — As Cidadelas 360º" },
      {
        name: "description",
        content:
          "Conheça a missão da Rede Mundi e o movimento As Cidadelas 360º. Fé, arte e ação concreta.",
      },
    ],
  }),
});

const PILARES = [
  { icon: Heart, title: "Fé", text: "Enraizada nos preceitos cristãos e no Sagrado Coração." },
  { icon: Globe, title: "Missão", text: "Levar a mensagem para além da oração — em ações concretas." },
  { icon: Sparkles, title: "Arte", text: "Símbolos, palavras e objetos que comunicam o sagrado." },
];

function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Rede Mundi · Tegri-Gei
        </p>
        <h1 className="mt-4 text-display text-5xl font-medium leading-[1.05] text-foreground md:text-7xl">
          Uma missão <br />
          <span className="italic text-primary">de 360 graus.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Nascemos da convicção de que a fé cristã não se encerra dentro das
          igrejas. Ela atravessa territórios, cidades e corações — vestindo-se
          de arte, palavra e gesto.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {PILARES.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-border bg-card p-8 transition-all hover:border-gold hover:shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-wine">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-6 text-display text-2xl font-medium text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="divider-ornament mb-10">
          <Heart className="h-4 w-4" />
        </div>
        <blockquote className="text-display text-3xl font-medium italic leading-snug text-foreground md:text-4xl">
          "Conforme preceitos cristãos, transformamos a luta espiritual em
          ações práticas — porque a oração, sem ação, é considerada incompleta."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold">
          Marcelo Trindade
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
