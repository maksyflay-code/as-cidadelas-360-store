export type CatalogProduct = {
  slug: string;
  image: string;
  name: string;
  category: string;
  price: string;
  badge: string;
  description: string;
};

const ASSETS = {
  cidadelasPt: "/__l5e/assets-v1/01475066-d617-498e-83be-bd61482dee52/ebook-cidadelas-pt.png",
  cidadelasEn: "/__l5e/assets-v1/5d5ed4b8-f636-42ae-b19a-190a475b9063/ebook-cidadelas-en.png",
  cidadelasIt: "/__l5e/assets-v1/b612441f-cd7b-4512-ada0-7b06515f1549/ebook-cidadelas-it.png",
  planoPt: "/__l5e/assets-v1/edc49994-5960-4c69-9473-0b5919dbf882/ebook-plano-pt.png",
  planoEn: "/__l5e/assets-v1/f36f3072-cc26-4c41-90b3-f18ea0424534/ebook-plano-en.png",
  planoIt: "/__l5e/assets-v1/6243bbf5-c19e-4b85-8b6b-0745a0de5536/ebook-plano-it.png",
} as const;

export const EBOOKS: CatalogProduct[] = [
  {
    slug: "ebook-cidadelas-portugues",
    image: ASSETS.cidadelasPt,
    name: "As Cidadelas da Esperança 360º",
    category: "E-book · Português",
    price: "R$ 35,00",
    badge: "Português",
    description: "Edição digital em português de As Cidadelas da Esperança 360º.",
  },
  {
    slug: "ebook-cidadelas-ingles",
    image: ASSETS.cidadelasEn,
    name: "The Citadels of Hope 360º",
    category: "E-book · Inglês",
    price: "R$ 35,00",
    badge: "English",
    description: "English digital edition of The Citadels of Hope 360º.",
  },
  {
    slug: "ebook-cidadelas-italiano",
    image: ASSETS.cidadelasIt,
    name: "Le Cittadelle della Speranza a 360º",
    category: "E-book · Italiano",
    price: "R$ 35,00",
    badge: "Italiano",
    description: "Edizione digitale in italiano di Le Cittadelle della Speranza a 360º.",
  },
  {
    slug: "ebook-plano-negocios-portugues",
    image: ASSETS.planoPt,
    name: "Plano de Negócios",
    category: "E-book · Português",
    price: "R$ 27,00",
    badge: "Português",
    description: "Edição digital em português do Plano de Negócios das Cidadelas da Esperança 360º.",
  },
  {
    slug: "ebook-plano-negocios-ingles",
    image: ASSETS.planoEn,
    name: "Business Plan",
    category: "E-book · Inglês",
    price: "R$ 27,00",
    badge: "English",
    description: "English digital edition of The Citadels of Hope 360º Business Plan.",
  },
  {
    slug: "ebook-plano-negocios-italiano",
    image: ASSETS.planoIt,
    name: "Piano Aziendale",
    category: "E-book · Italiano",
    price: "R$ 27,00",
    badge: "Italiano",
    description: "Edizione digitale in italiano del Piano Aziendale delle Cittadelle della Speranza a 360º.",
  },
];

export const EBOOK_SLUGS = new Set(EBOOKS.map((product) => product.slug));

export function getCatalogImage(slug: string): string {
  return EBOOKS.find((product) => product.slug === slug)?.image ?? ASSETS.cidadelasPt;
}