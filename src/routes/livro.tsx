import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import livroCapa from "@/assets/livro-capa.png";

export const Route = createFileRoute("/livro")({
  component: LivroPage,
  head: () => ({
    meta: [
      { title: "As Cidadelas da Esperança — Marcelo Trindade" },
      {
        name: "description",
        content:
          "O e-book 'As Cidadelas da Esperança' de Marcelo Trindade. Uma reflexão sobre cristãos como administradores do bem divino.",
      },
      { property: "og:title", content: "As Cidadelas da Esperança 360º — Marcelo Trindade" },
      { property: "og:description", content: "Conheça a obra e escolha o e-book em português, inglês ou italiano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const FEATURES = [
  "Reflexão profunda sobre a missão cristã hoje",
  "Convocação à batalha espiritual do bem contra o mal",
  "Modelo concreto de ação evangelizadora (MVP)",
  "Baseado no princípio de Marcos 9:23",
  "Edição cuidadosa, capa e diagramação dedicadas",
];

function LivroPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radiance opacity-50" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pt-20 pb-32 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="frame-baroque mx-auto max-w-md animate-float">
            <img
              src={livroCapa}
              alt="Capa do livro As Cidadelas da Esperança 360º"
              className="w-full rounded-md object-cover"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Marcelo Trindade · Rede Mundi
            </p>
            <h1 className="mt-4 text-display text-5xl font-medium leading-[1.02] text-foreground md:text-7xl">
              As Cidadelas <br />
              da <span className="italic text-primary">Esperança</span>
              <span className="text-3xl text-gold md:text-5xl"> 360º</span>
            </h1>
            <p className="mt-6 text-display text-xl italic text-muted-foreground">
              "Tudo é possível ao que crê." — Marcos 9:23
            </p>

            <p className="mt-8 max-w-xl leading-relaxed text-foreground/80">
              Vivemos e morremos corporalmente neste planeta. O autor convoca
              humildemente os cristãos a uma batalha espiritual do bem contra o
              mal, conforme preceitos cristãos, transformando essa luta em
              ações práticas — indo além da oração, que muitas vezes é
              considerada incompleta sem a devida ação.
            </p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-wine">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-10 max-w-sm">
              <Link to="/produto/$slug" params={{ slug: "ebook-cidadelas-portugues" }} className="group flex flex-col gap-2 rounded-xl border-2 border-primary bg-card p-6 text-left transition-all hover:bg-primary hover:text-primary-foreground">
                <div className="flex items-center gap-2 text-gold">
                  <Download className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">E-book · Português</span>
                </div>
                <p className="text-display text-3xl font-semibold">R$ 35,00</p>
                <p className="text-xs opacity-80">Formato digital · Sem frete</p>
              </Link>
              <Link to="/loja" className="mt-4 inline-flex text-sm font-semibold text-primary underline underline-offset-4">
                Ver edições em outros idiomas e o Plano de Negócios
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-wine py-24 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Sobre o autor
          </p>
          <h2 className="mt-4 text-display text-4xl font-medium md:text-5xl">
            Marcelo Trindade
          </h2>
          <p className="mt-6 leading-relaxed text-primary-foreground/85">
            Idealizador da Rede Mundi (Territórios · Cidades), Marcelo dedica
            sua obra à articulação de uma fé prática — onde a oração se faz
            ação e a esperança se torna estrutura. "As Cidadelas da Esperança"
            é o ponto de partida desse movimento.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
