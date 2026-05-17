import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import camisaAfrica from "@/assets/produto-camisa-africa.jpg";
import camisaAmericas from "@/assets/produto-camisa-americas.jpg";
import camisaAsia from "@/assets/produto-camisa-asia.jpg";
import camisaEuropa from "@/assets/produto-camisa-europa.jpg";
import camisaOceania from "@/assets/produto-camisa-oceania.jpg";
import bone from "@/assets/produto-bone.jpg";
import chaveiro from "@/assets/produto-chaveiro.jpg";
import livroCapa from "@/assets/livro-capa.png";
import caneca from "@/assets/produto-caneca.jpg";
import moletom from "@/assets/produto-moletom.jpg";

export const Route = createFileRoute("/loja")({
  component: LojaPage,
  head: () => ({
    meta: [
      { title: "Loja — As Cidadelas 360º" },
      {
        name: "description",
        content:
          "Camisas, bonés, chaveiros e o livro As Cidadelas da Esperança. Toda a coleção devocional As Cidadelas 360º.",
      },
    ],
  }),
});

const ALL = [
  { slug: "camisa-africa", image: camisaAfrica, name: "Camisa Continente África", category: "Vestuário · Coleção 5 Continentes", price: "R$ 129", badge: "África" },
  { slug: "camisa-americas", image: camisaAmericas, name: "Camisa Continente Américas", category: "Vestuário · Coleção 5 Continentes", price: "R$ 129", badge: "Américas" },
  { slug: "camisa-asia", image: camisaAsia, name: "Camisa Continente Ásia", category: "Vestuário · Coleção 5 Continentes", price: "R$ 129", badge: "Ásia" },
  { slug: "camisa-europa", image: camisaEuropa, name: "Camisa Continente Europa", category: "Vestuário · Coleção 5 Continentes", price: "R$ 129", badge: "Europa" },
  { slug: "camisa-oceania", image: camisaOceania, name: "Camisa Continente Oceania", category: "Vestuário · Coleção 5 Continentes", price: "R$ 129", badge: "Oceania" },
  { slug: "bone-cruz-dourada", image: bone, name: "Boné Cruz Dourada", category: "Acessórios", price: "R$ 89" },
  { slug: "bone-cidadelas", image: bone, name: "Boné Cidadelas 360º", category: "Acessórios", price: "R$ 89" },
  { slug: "chaveiro-reliquia", image: chaveiro, name: "Chaveiro Relíquia", category: "Acessórios", price: "R$ 39" },
  { slug: "moletom-cidadelas", image: moletom, name: "Moletom Cidadelas 360º", category: "Vestuário", price: "R$ 249", badge: "Inverno" },
  { slug: "caneca-cidadelas", image: caneca, name: "Caneca As Cidadelas da Esperança 360º", category: "Casa & Cotidiano", price: "R$ 59" },
  { slug: "livro-impresso", image: livroCapa, name: "As Cidadelas da Esperança · Impresso", category: "Livro", price: "R$ 59", badge: "Best-seller" },
  { slug: "livro-digital", image: livroCapa, name: "As Cidadelas da Esperança · Digital", category: "Livro · E-book", price: "R$ 29" },
];

const FILTERS = ["Todos", "Vestuário", "Acessórios", "Casa & Cotidiano", "Livro"];

function LojaPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Catálogo completo
        </p>
        <h1 className="mt-4 text-display text-5xl font-medium leading-[1.05] text-foreground md:text-7xl">
          A Loja
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Cada peça da nossa coleção carrega um símbolo, uma palavra, um
          chamado. Vista a fé, leve a esperança, anuncie o Reino.
        </p>
      </section>

      <div className="mx-auto mb-12 flex max-w-7xl flex-wrap justify-center gap-2 px-6">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ALL.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
