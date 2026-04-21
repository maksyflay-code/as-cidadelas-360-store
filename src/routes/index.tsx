import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Heart, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import heroImg from "@/assets/hero-sagrado.jpg";
import camisa from "@/assets/produto-camisa.jpg";
import bone from "@/assets/produto-bone.jpg";
import chaveiro from "@/assets/produto-chaveiro.jpg";
import livroCapa from "@/assets/livro-capa.png";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "As Cidadelas 360º — Fé, Arte e Missão" },
      {
        name: "description",
        content:
          "Loja oficial As Cidadelas 360º. Camisas, bonés, chaveiros e o livro 'As Cidadelas da Esperança' de Marcelo Trindade. Vamos evangelizar.",
      },
    ],
  }),
});

const PRODUCTS = [
  { image: camisa, name: "Camisa Sagrado Coração", category: "Vestuário", price: "R$ 129", badge: "Novo" },
  { image: livroCapa, name: "As Cidadelas da Esperança", category: "Livro · Impresso", price: "R$ 59", badge: "Best-seller" },
  { image: bone, name: "Boné Cruz Dourada", category: "Acessórios", price: "R$ 89" },
  { image: chaveiro, name: "Chaveiro Relíquia", category: "Devocionais", price: "R$ 39" },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radiance opacity-60" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-24 lg:pb-32">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/60 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/70">
                Rede Mundi · Vamos Evangelizar
              </span>
            </div>

            <h1 className="mt-8 text-display text-5xl font-medium leading-[1.05] text-foreground md:text-7xl lg:text-[5.5rem]">
              Fé feita
              <span className="block italic text-primary">arte vestida.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Camisas, bonés, chaveiros e o livro que inspirou um movimento
              missionário. Cada peça é um pedaço da nossa missão: levar a luz
              das Cidadelas da Esperança ao mundo.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/loja"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-wine px-7 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:shadow-relic"
              >
                Explorar a loja
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/livro"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-medium text-foreground transition-all hover:border-primary"
              >
                <BookOpen className="h-4 w-4" />
                Conhecer o livro
              </Link>
            </div>

            <div className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              <Stat n="360º" label="Visão integral" />
              <Stat n="+1k" label="Leitores" />
              <Stat n="100%" label="Missionário" />
            </div>
          </div>

          <div className="relative">
            <div className="frame-baroque animate-float">
              <img
                src={heroImg}
                alt="Sagrado Coração de Jesus envolto em chamas e raios divinos"
                width={1920}
                height={1280}
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card/95 px-5 py-4 shadow-relic backdrop-blur md:block">
              <p className="text-display text-2xl text-primary">"Tudo é possível</p>
              <p className="text-display text-2xl italic text-foreground">ao que crê."</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gold">Marcos 9:23</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="divider-ornament mb-12">
          <Heart className="h-4 w-4" />
        </div>

        <div className="mb-14 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Coleção Inaugural
            </p>
            <h2 className="mt-3 text-display text-4xl font-medium leading-tight text-foreground md:text-5xl">
              Símbolos para vestir,<br />
              <span className="italic text-primary">palavras para guardar.</span>
            </h2>
          </div>
          <Link
            to="/loja"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </section>

      {/* DESTAQUE LIVRO */}
      <section className="relative overflow-hidden bg-gradient-wine py-28 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-radiance opacity-30" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="frame-baroque mx-auto max-w-sm">
            <img
              src={livroCapa}
              alt="Capa do livro As Cidadelas da Esperança"
              loading="lazy"
              className="w-full rounded-md object-cover shadow-relic"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Livro · Marcelo Trindade
            </p>
            <h2 className="mt-4 text-display text-5xl font-medium leading-[1.05] md:text-6xl">
              As Cidadelas <br />
              da <span className="italic text-gold">Esperança</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80">
              Uma reflexão profunda sobre o papel dos cristãos como
              administradores do bem divino neste mundo. Uma convocação humilde
              à batalha espiritual do bem contra o mal — não apenas em oração,
              mas em ações concretas guiadas pela ética cristã.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-wine-deep transition-all hover:shadow-glow">
                Comprar impresso · R$ 59
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-transparent px-7 py-4 text-sm font-medium text-gold transition-all hover:bg-gold/10">
                Versão digital · R$ 29
              </button>
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-gold/80">
              MVP · Modelo inicial de ação concreta
            </p>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <div className="divider-ornament mb-10">
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Nossa Missão
        </p>
        <blockquote className="mt-6 text-display text-3xl font-medium leading-snug text-foreground md:text-5xl">
          "Não somos donos deste mundo. <br />
          Somos <span className="italic text-primary">administradores</span> do
          bem divino — chamados a transformar oração em <span className="italic text-primary">ação</span>."
        </blockquote>
        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          — Marcelo Trindade
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-display text-3xl font-semibold text-primary">{n}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
