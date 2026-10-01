import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { EBOOKS } from "@/lib/catalog";

export const Route = createFileRoute("/loja")({
  component: LojaPage,
  head: () => ({
    meta: [
      { title: "Loja — As Cidadelas 360º" },
      {
        name: "description",
        content: "E-books As Cidadelas da Esperança 360º e Plano de Negócios em português, inglês e italiano.",
      },
      { property: "og:title", content: "Loja de e-books — As Cidadelas 360º" },
      { property: "og:description", content: "Escolha entre seis e-books em português, inglês e italiano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function LojaPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Biblioteca digital
        </p>
        <h1 className="mt-4 text-display text-5xl font-medium leading-[1.05] text-foreground md:text-7xl">
          E-books
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Escolha o título e o idioma. Todos os livros são digitais, sem frete,
          para você acessar de onde estiver.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EBOOKS.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
